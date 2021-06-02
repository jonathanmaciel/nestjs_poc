
CREATE TABLE tb_contacts (
  contacts_id INTEGER PRIMARY KEY AUTOINCREMENT,
  contacts_name VARCHAR(250),
  contacts_description VARCHAR(250)
);

CREATE TABLE tb_contact_means(
  contacts_id INTEGER,
  contact_means_id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_means_name VARCHAR(250),
  contact_means_value VARCHAR(250),
  contact_means_description VARCHAR(250),
  contact_means_is_main NUMBER,
  FOREIGN KEY(contacts_id) REFERENCES tb_contacts(CONTACTS_ID)
);

CREATE TABLE TB_SETTINGS(
  settings_id integer PRIMARY KEY AUTOINCREMENT,
  settings_value VARCHAR(100)
);

INSERT INTO tb_settings (settings_value) VALUES (1);

INSERT INTO tb_settings (settings_value) VALUES (2);