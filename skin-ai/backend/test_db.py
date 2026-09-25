import traceback
try:
    from app.database import engine, Base
    print('Engine imported')
    with engine.connect() as conn:
        print('Connected successfully')
    Base.metadata.create_all(bind=engine)
    print('Tables verified')
except Exception as e:
    print('CRASH!!!')
    traceback.print_exc()
