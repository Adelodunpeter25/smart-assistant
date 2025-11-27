"""Authentication service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User, RefreshToken
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token


class AuthService:
    """Service for authentication operations."""

    @staticmethod
    async def create_user(db: AsyncSession, name: str, email: str, password: str) -> User:
        """Create a new user."""
        password_hash = hash_password(password)
        user = User(name=name, email=email, password_hash=password_hash)
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
        """Get user by email."""
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
        """Authenticate user with email and password."""
        user = await AuthService.get_user_by_email(db, email)
        if not user or not user.is_active:
            return None
        if not verify_password(user.password_hash, password):
            return None
        return user

    @staticmethod
    async def create_tokens(db: AsyncSession, user_id: int) -> tuple[str, str]:
        """Create access and refresh tokens for user."""
        access_token = create_access_token(user_id)
        refresh_token_str, expires_at = create_refresh_token()
        
        # Store refresh token in database
        refresh_token = RefreshToken(
            user_id=user_id,
            token=refresh_token_str,
            expires_at=expires_at
        )
        db.add(refresh_token)
        await db.flush()
        
        return access_token, refresh_token_str

    @staticmethod
    async def verify_refresh_token(db: AsyncSession, token: str) -> User | None:
        """Verify refresh token and return user."""
        query = select(RefreshToken).where(
            RefreshToken.token == token,
            RefreshToken.is_revoked == False
        )
        result = await db.execute(query)
        refresh_token = result.scalar_one_or_none()
        
        if not refresh_token:
            return None
        
        # Check if token expired
        from datetime import datetime
        if refresh_token.expires_at < datetime.utcnow():
            return None
        
        # Get user
        query = select(User).where(User.id == refresh_token.user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def revoke_refresh_token(db: AsyncSession, token: str) -> bool:
        """Revoke a refresh token."""
        query = select(RefreshToken).where(RefreshToken.token == token)
        result = await db.execute(query)
        refresh_token = result.scalar_one_or_none()
        
        if not refresh_token:
            return False
        
        refresh_token.is_revoked = True
        await db.flush()
        return True
