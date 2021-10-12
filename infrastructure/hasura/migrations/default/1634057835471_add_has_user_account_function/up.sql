CREATE FUNCTION has_user_account(user_row "user")
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT * FROM account WHERE user_id = user_row.id);
$$ LANGUAGE sql STABLE;
