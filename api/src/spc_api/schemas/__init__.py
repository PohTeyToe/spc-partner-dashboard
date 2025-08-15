from marshmallow import Schema, fields


class HealthSchema(Schema):
    status = fields.String(required=True)


class MerchantSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    merchant_id = fields.Int(allow_none=True)


# Export Deal schemas from the dedicated module
from .deal import DealSchema, DealCreateSchema, DealUpdateSchema  # noqa: E402,F401


