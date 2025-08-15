from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, desc
from ..extensions import db
from ..models import Deal, User
from ..schemas import DealSchema, DealCreateSchema, DealUpdateSchema

bp = Blueprint("deals", __name__)


def _get_current_merchant_id():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    return user.merchant_id if user else None


@bp.get("")
@jwt_required()
def list_deals():
    merchant_id = _get_current_merchant_id()
    if not merchant_id:
        return jsonify({"message": "merchant not found for user"}), 403

    try:
        page = int(request.args.get("page", 1))
        per_page = min(int(request.args.get("per_page", 20)), 50)
    except ValueError:
        return jsonify({"message": "invalid pagination"}), 400

    q = (request.args.get("q") or "").strip()
    active_param = request.args.get("active")
    active = None
    if active_param is not None:
        if active_param.lower() in ("true", "1"):
            active = True
        elif active_param.lower() in ("false", "0"):
            active = False

    query = db.session.query(Deal).filter(Deal.merchant_id == merchant_id)

    if q:
        pattern = f"%{q}%"
        query = query.filter(or_(Deal.title.ilike(pattern), Deal.description.ilike(pattern)))

    if active is not None and hasattr(Deal, 'active'):
        query = query.filter(Deal.active == active)

    if hasattr(Deal, 'created_at'):
        query = query.order_by(desc(Deal.created_at))
    else:
        query = query.order_by(desc(Deal.id))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    items = DealSchema(many=True).dump(pagination.items)
    return jsonify({
        "items": items,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev,
    })


@bp.get("/<int:deal_id>")
@jwt_required()
def get_deal(deal_id: int):
    merchant_id = _get_current_merchant_id()
    if not merchant_id:
        return jsonify({"message": "merchant not found for user"}), 403
    deal = db.session.get(Deal, deal_id)
    if not deal or deal.merchant_id != merchant_id:
        return jsonify({"message": "not found"}), 404
    return jsonify(DealSchema().dump(deal))


@bp.post("")
@jwt_required()
def create_deal():
    merchant_id = _get_current_merchant_id()
    if not merchant_id:
        return jsonify({"message": "merchant not found for user"}), 403

    data = request.get_json(silent=True) or {}
    errors = DealCreateSchema().validate(data)
    if errors:
        return jsonify(errors), 400

    deal = Deal(
        title=data["title"],
        description=data.get("description"),
        merchant_id=merchant_id,
    )
    if hasattr(Deal, 'active'):
        deal.active = bool(data.get('active', True))
    db.session.add(deal)
    db.session.commit()
    return jsonify(DealSchema().dump(deal)), 201


@bp.patch("/<int:deal_id>")
@jwt_required()
def update_deal(deal_id: int):
    merchant_id = _get_current_merchant_id()
    if not merchant_id:
        return jsonify({"message": "merchant not found for user"}), 403
    deal = db.session.get(Deal, deal_id)
    if not deal or deal.merchant_id != merchant_id:
        return jsonify({"message": "not found"}), 404

    data = request.get_json(silent=True) or {}
    errors = DealUpdateSchema().validate(data, partial=True)
    if errors:
        return jsonify(errors), 400

    if 'title' in data:
        deal.title = data['title']
    if 'description' in data:
        deal.description = data['description']
    if 'active' in data and hasattr(Deal, 'active'):
        deal.active = bool(data['active'])
    db.session.commit()
    return jsonify(DealSchema().dump(deal))


@bp.delete("/<int:deal_id>")
@jwt_required()
def delete_deal(deal_id: int):
    merchant_id = _get_current_merchant_id()
    if not merchant_id:
        return jsonify({"message": "merchant not found for user"}), 403
    deal = db.session.get(Deal, deal_id)
    if not deal or deal.merchant_id != merchant_id:
        return jsonify({"message": "not found"}), 404
    db.session.delete(deal)
    db.session.commit()
    return ("", 204)
