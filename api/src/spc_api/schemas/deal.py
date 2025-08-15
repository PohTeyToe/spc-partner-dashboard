from marshmallow import Schema, fields


class DealSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class DealCreateSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(allow_none=True)


class DealUpdateSchema(Schema):
    title = fields.Str()
    description = fields.Str(allow_none=True)
