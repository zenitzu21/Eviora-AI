from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Skin AI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to Skin AI API"}

from .database import Base, engine
from .api import auth_router, ai_router

Base.metadata.create_all(bind=engine)

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(ai_router.router, prefix="/api/ai", tags=["ai"])
