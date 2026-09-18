from app.schemas import CommunityPostCreate
from app.services.rate_limit import InvalidCredentialGate
from app.services.security import hash_password, hash_token, issue_api_key, verify_password


def test_password_hashes_are_salted_and_verifiable() -> None:
    first = hash_password("a-long-development-password")
    second = hash_password("a-long-development-password")

    assert first != second
    assert verify_password("a-long-development-password", first)
    assert not verify_password("the-wrong-password", first)


def test_api_keys_are_prefixed_and_stored_as_digests() -> None:
    key = issue_api_key()

    assert key.startswith("tos_live_")
    assert key not in hash_token(key)
    assert len(hash_token(key)) == 64


def test_community_text_is_bounded_plain_data() -> None:
    payload = CommunityPostCreate(
        title="  <script>alert('literal')</script>\x00  ",
        body="SELECT * FROM users; --\x01",
    )

    assert payload.title == "<script>alert('literal')</script>"
    assert payload.body == "SELECT * FROM users; --"


def test_invalid_credential_gate_stops_repeated_attempts() -> None:
    gate = InvalidCredentialGate()
    for _ in range(3):
        gate.record("test-client")

    assert gate.blocked("test-client", 3)
    assert not gate.blocked("another-client", 3)
