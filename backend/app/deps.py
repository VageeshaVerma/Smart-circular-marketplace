from fastapi import Header, HTTPException, Depends,status
from app.firebase import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.store import USERS

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    user = verify_token(token)
    print("Token received from frontend:", token)
    print("Decoded token from Firebase:", user)
    print("Current USERS dict:", USERS)
    if not user :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return {"uid": user["uid"], "email": user.get("email")}

