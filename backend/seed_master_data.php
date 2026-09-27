<?php
/**
 * NIRMAAN 2.0 — Master Data Seeder
 * Seeds platform roles, professions, trade skills, and bootstrap Super Admin.
 * Does NOT create any fake users, fake workers, fake jobs, fake projects, or fake reviews.
 */

require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDbConnection();
    echo "=== SEEDING MASTER DATA (PLATFORM TAXONOMY & ADMIN BOOTSTRAP) ===\n";

    $pdo->beginTransaction();

    // 1. ROLES
    $roles = [
        [1, 'Super Admin', 'SUPER_ADMIN', 'Platform control centre & governance'],
        [2, 'Worker', 'WORKER', 'Artisan craftsman with digital Work Passport'],
        [3, 'Homeowner', 'HOMEOWNER', 'Individual site owner building or renovating'],
        [4, 'Contractor', 'CONTRACTOR', 'Commercial builder managing workforce & projects'],
        [5, 'Employee', 'EMPLOYEE', 'Corporate & field engineering employee']
    ];
    $stmtRole = $pdo->prepare("
        INSERT INTO `roles` (`id`, `name`, `slug`, `description`)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `description`=VALUES(`description`)
    ");
    foreach ($roles as $r) {
        $stmtRole->execute($r);
    }
    echo "✔ Roles verified: " . count($roles) . " roles.\n";

    // 2. PROFESSIONS (11 standard trades)
    $professions = [
        [1, 'Mason', 'mason', 'Brickwork, structural masonry, plastering and AAC blockwork', 'BrickWall', 'active'],
        [2, 'Electrician', 'electrician', 'Concealed conduit wiring, DB dressing, solar and fixture installation', 'Zap', 'active'],
        [3, 'Plumber', 'plumber', 'CPVC sanitary piping, leakage repair, water tank and drainage fitting', 'Droplets', 'active'],
        [4, 'Carpenter', 'carpenter', 'Wood framing, modular kitchen, door shutters and custom furniture', 'Hammer', 'active'],
        [5, 'Painter', 'painter', 'Interior wall finish, exterior emulsion, texture coat and waterproofing', 'Paintbrush', 'active'],
        [6, 'Tile Worker', 'tile-worker', 'Anti-skid floor vitrified tiling, wall dado and granite counter laying', 'Grid', 'active'],
        [7, 'Welder', 'welder', 'Metal gate fabrication, MS structure welding and railing alignment', 'Flame', 'active'],
        [8, 'HVAC Technician', 'hvac', 'Split AC copper piping, central chiller ducting and gas charging', 'Wind', 'active'],
        [9, 'Roofer', 'roofer', 'Shed roofing, tar felting, ridge tile laying and metal truss erection', 'Home', 'active'],
        [10, 'Flooring Worker', 'flooring', 'Italian marble polishing, granite floor laying and vinyl installation', 'Layers', 'active'],
        [11, 'General Helper', 'helper', 'Cement mortar mixing, site debris clearing and raw material staging', 'HardHat', 'active']
    ];
    $stmtProf = $pdo->prepare("
        INSERT INTO `professions` (`id`, `name`, `slug`, `description`, `icon`, `status`)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `description`=VALUES(`description`), `icon`=VALUES(`icon`), `status`=VALUES(`status`)
    ");
    foreach ($professions as $p) {
        $stmtProf->execute($p);
    }
    echo "✔ Professions verified: " . count($professions) . " professions.\n";

    // 3. SKILLS (38 skills mapped to professions)
    $skills = [
        [1, 1, 'Brickwork', 'brickwork', 'Clay brick and fly-ash brick laying'],
        [2, 1, 'Plaster', 'plaster', 'Smooth wall sand-cement plaster finish'],
        [3, 1, 'RCC Work', 'rcc-work', 'Reinforced cement concrete casting'],
        [4, 1, 'Blockwork', 'blockwork', 'AAC lightweight masonry block jointing'],
        [5, 1, 'Foundation', 'foundation', 'Excavation footing and damp proof course'],
        [6, 2, 'Conduit Wiring', 'conduit-wiring', 'Concealed PVC pipe copper cable pulling'],
        [7, 2, 'DB Installation', 'db-installation', 'Distribution board and MCB dressing'],
        [8, 2, 'CCTV & Intercom', 'cctv', 'Security camera and door phone setup'],
        [9, 2, 'Solar Setup', 'solar', 'Rooftop solar panel inverter connection'],
        [10, 2, 'AC Wiring', 'ac-wiring', 'Dedicated 16A power line installation'],
        [11, 3, 'Pipe Fitting', 'pipe-fitting', 'Concealed CPVC/UPVC water line connections'],
        [12, 3, 'Bathroom Sanitary', 'sanitary', 'Wall-hung commode and diverter installation'],
        [13, 3, 'Water Tank', 'water-tank', 'Overhead loft tank and motor booster setup'],
        [14, 3, 'Drainage', 'drainage', 'SWR soil and waste pipe slope laying'],
        [15, 3, 'Leak Repair', 'leak-repair', 'Pressure pump testing and leak rectification'],
        [16, 4, 'Modular Kitchen', 'modular-kitchen', 'Cabinet carcass assembly and hinge fixing'],
        [17, 4, 'Door Shutters', 'doors', 'Flush door and teak frame hanging'],
        [18, 4, 'Custom Furniture', 'furniture', 'Wardrobes, bed boxes and study units'],
        [19, 4, 'Wood Repair', 'wood-repair', 'Chipped veneer and laminate restoration'],
        [20, 5, 'Interior Emulsion', 'interior-emulsion', 'Putty sanding and acrylic emulsion rolling'],
        [21, 5, 'Exterior Weather-Proof', 'exterior', 'Silicon weatherproof facade painting'],
        [22, 5, 'Texture Finish', 'texture', 'Stucco and designer stencil wall texture'],
        [23, 5, 'Waterproofing', 'waterproofing', 'Liquid membrane brush application'],
        [24, 6, 'Vitrified Floor Tiles', 'floor-tiles', 'Laser aligned 600x1200mm floor tiling'],
        [25, 6, 'Bathroom Wall Dado', 'wall-dado', 'Full height glazed ceramic dado fixing'],
        [26, 6, 'Granite Countertops', 'granite', 'Kitchen platform bullnosing and polish'],
        [27, 6, 'Anti-Skid Gradient', 'anti-skid', 'Shower area slope water runoff levelling'],
        [28, 7, 'MS Gate Fabrication', 'gate-work', 'Ornamental main gate welding and hinge fit'],
        [29, 7, 'Structural Welding', 'structural-welding', 'Heavy I-beam and channel arc welding'],
        [30, 7, 'Railing Alignment', 'railing', 'Balcony safety grill and SS pipe welding'],
        [31, 8, 'Split AC Installation', 'split-ac', 'Copper piping flare and indoor unit mount'],
        [32, 8, 'Gas Charging', 'gas-charging', 'R32 / R410A refrigerant vacuum and refill'],
        [33, 8, 'Ducting & Maintenance', 'ducting', 'Galvanized iron sheet ducting and coil wash'],
        [34, 9, 'Profile Sheet Roofing', 'sheet-roofing', 'Color coated steel sheet self-drilling fix'],
        [35, 9, 'Waterproofing Coat', 'roof-waterproofing', 'App membrane heat torch application'],
        [36, 9, 'Clay Tile Laying', 'clay-tiles', 'Mangalore terracotta ridge tile mortar fixing'],
        [37, 10, 'Italian Marble Polish', 'marble-polish', 'Diamond abrasive pad diamond crystallization'],
        [38, 10, 'Kota Stone Laying', 'kota-stone', 'Zero joint natural green stone flooring']
    ];
    $stmtSkill = $pdo->prepare("
        INSERT INTO `skills` (`id`, `profession_id`, `name`, `slug`, `description`)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `description`=VALUES(`description`)
    ");
    foreach ($skills as $s) {
        $stmtSkill->execute($s);
    }
    echo "✔ Skills verified: " . count($skills) . " skills mapped to professions.\n";

    // 4. BOOTSTRAP SUPER ADMIN ACCOUNT (admin@nirmaan.local)
    // Password: Admin@123
    $adminPasswordHash = password_hash('Admin@123', PASSWORD_BCRYPT);
    $stmtAdmin = $pdo->prepare("
        INSERT INTO `users` (
            `id`, `registration_id`, `role`, `role_id`, `full_name`, `name`, `email`, `phone`, `password_hash`, `status`
        ) VALUES (
            1, 'ADM-000001', 'admin', 1, 'Super Administrator', 'Super Administrator', 'admin@nirmaan.local', '9999900001', ?, 'active'
        )
        ON DUPLICATE KEY UPDATE 
            `registration_id` = 'ADM-000001',
            `role` = 'admin',
            `role_id` = 1,
            `full_name` = 'Super Administrator',
            `name` = 'Super Administrator',
            `email` = 'admin@nirmaan.local',
            `phone` = '9999900001',
            `status` = 'active'
    ");
    $stmtAdmin->execute([$adminPasswordHash]);
    echo "✔ Bootstrap Administrator account verified (admin@nirmaan.local / 9999900001).\n";

    $pdo->commit();
    echo "=== MASTER DATA SEED COMPLETED SUCCESSFULLY ===\n";
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Error during master data seed: " . $e->getMessage() . "\n";
    exit(1);
}
