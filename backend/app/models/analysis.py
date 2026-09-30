from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime

from app.models.database import Base


class Analysis(Base):

    __tablename__ = "analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    image_path = Column(
        String(500),
        nullable=False,
    )

    object_name = Column(
        String(200),
        nullable=False,
    )

    material = Column(
        String(200),
        nullable=False,
    )

    condition = Column(
        String(100),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    status = Column(
        String(50),
        default="completed",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )