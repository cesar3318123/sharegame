-- Inserta usuarios de prueba
INSERT INTO users (username, email, password, role)
VALUES 
  ('gamer1', 'gamer1@example.com', '$2b$10$hashedPassword1', 'user'),
  ('mod_john', 'moderador@example.com', '$2b$10$hashedPassword2', 'moderator'),
  ('admin_luisa', 'admin@example.com', '$2b$10$hashedPassword3', 'admin');
