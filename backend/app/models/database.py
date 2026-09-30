from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# =========================
# MYSQL DATABASE CONFIG
# =========================

DATABASE_URL = (
    "mysql+pymysql://root:Root@localhost:3306/circular_ai"
)


# =========================
# DATABASE ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    echo=True,
)


# =========================
# SESSION
# =========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# =========================
# BASE MODEL
# =========================

Base = declarative_base()


# =========================
# DATABASE DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()