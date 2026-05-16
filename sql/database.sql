-- Database schema for the premium gym website.
-- It stores contact inquiries and gallery metadata using utf8mb4 for broad text support.

CREATE DATABASE IF NOT EXISTS gym_premium
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gym_premium;

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_inquiries_email (email),
    INDEX idx_contact_inquiries_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    category VARCHAR(80) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gallery_items_category (category),
    INDEX idx_gallery_items_active_order (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO gallery_items (title, category, image_path, alt_text, sort_order) VALUES
('Strength Performance Floor', 'Strength', 'assets/img/luxury-gym-floor.svg', 'Premium gym strength floor with red lighting', 1),
('Boutique HIIT Studio', 'Classes', 'assets/img/hiit-studio.svg', 'Dark boutique HIIT studio with training stations', 2),
('Recovery Lounge', 'Wellness', 'assets/img/recovery-lounge.svg', 'Premium wellness recovery lounge', 3),
('Personal Coaching Zone', 'Coaching', 'assets/img/coaching-zone.svg', 'Personal coaching area with equipment', 4),
('Cardio Theatre', 'Cardio', 'assets/img/cardio-theatre.svg', 'Premium cardio theatre with city view', 5),
('Luxury Change Rooms', 'Amenities', 'assets/img/change-room.svg', 'Luxury gym change room lockers', 6);
