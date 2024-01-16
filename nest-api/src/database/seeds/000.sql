INSERT INTO health (id, name, is_published) VALUES (1, 'check-db', true) ON CONFLICT DO NOTHING;
INSERT INTO users (username, password) VALUES ('baris', '123') ON CONFLICT DO NOTHING;
INSERT INTO users (username, password) VALUES ('ali', '123') ON CONFLICT DO NOTHING;
