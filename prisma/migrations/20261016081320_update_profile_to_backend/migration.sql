UPDATE "Profile"
SET "role" = 'Backend & Database'
WHERE "role" = 'Frontend & Database';

UPDATE "Profile"
SET "headline" = 'Backend Developer'
WHERE "headline" = 'Frontend Developer';

UPDATE "Project"
SET "description" = 'Sistem informasi database dengan integrasi backend dan manajemen query efisien, didukung caching serta pengelolaan state modern.'
WHERE "description" = 'Sistem informasi database dengan integrasi frontend responsif dan manajemen query efisien, didukung caching dan modern state handler.';

UPDATE "SkillBadge"
SET "label" = 'Backend Architecture'
WHERE "label" = 'Frontend Architecture';
