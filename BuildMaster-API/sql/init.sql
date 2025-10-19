-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS buildmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE buildmaster;

-- 插入示例配件数据
INSERT INTO components (name, type, description, price, image_url, specifications, is_available, stock_quantity) VALUES
('Intel Core i5-13400F', 'CPU', '10核16线程处理器，基础频率2.5GHz', 1299.00, '/images/cpu.png', '{"cores": "10核16线程", "base_frequency": "2.5GHz", "max_turbo": "4.6GHz", "tdp": "65W"}', true, 50),
('Intel Core i7-13700F', 'CPU', '16核24线程处理器，基础频率2.1GHz', 2199.00, '/images/cpu.png', '{"cores": "16核24线程", "base_frequency": "2.1GHz", "max_turbo": "5.2GHz", "tdp": "65W"}', true, 30),
('NVIDIA RTX 4060', 'GPU', '8GB GDDR6显存，适合1080p游戏', 2399.00, '/images/gpu.png', '{"memory": "8GB GDDR6", "core_clock": "1830MHz", "memory_bus": "128-bit", "tdp": "115W"}', true, 25),
('NVIDIA RTX 4070', 'GPU', '12GB GDDR6X显存，适合1440p游戏', 4299.00, '/images/gpu.png', '{"memory": "12GB GDDR6X", "core_clock": "1920MHz", "memory_bus": "192-bit", "tdp": "200W"}', true, 15),
('MSI B760M PRO', 'MOTHERBOARD', 'Micro-ATX主板，支持DDR4内存', 699.00, '/images/motherboard.png', '{"chipset": "Intel B760", "memory_slots": "4个DDR4", "pcie_slots": "1个PCIe 4.0 x16", "sata_ports": "4个SATA 6Gb/s"}', true, 40),
('MSI Z790-A PRO', 'MOTHERBOARD', 'ATX主板，支持DDR5内存', 1299.00, '/images/motherboard.png', '{"chipset": "Intel Z790", "memory_slots": "4个DDR5", "pcie_slots": "2个PCIe 5.0 x16", "sata_ports": "6个SATA 6Gb/s"}', true, 20),
('Corsair Vengeance 16GB DDR4', 'RAM', '16GB DDR4-3200内存套装', 399.00, '/images/ram.png', '{"capacity": "16GB (2x8GB)", "frequency": "DDR4-3200", "timing": "CL16", "voltage": "1.35V"}', true, 100),
('Corsair Vengeance 32GB DDR5', 'RAM', '32GB DDR5-5600内存套装', 899.00, '/images/ram.png', '{"capacity": "32GB (2x16GB)", "frequency": "DDR5-5600", "timing": "CL36", "voltage": "1.25V"}', true, 50),
('Fractal Design Core 1000', 'CASE', '中塔式机箱，支持Micro-ATX主板', 299.00, '/images/case.png', '{"form_factor": "中塔式", "motherboard_support": "Micro-ATX", "drive_bays": "2个3.5寸", "fan_mounts": "2个120mm"}', true, 60),
('Fractal Design Define 7', 'CASE', '全塔式机箱，支持E-ATX主板', 899.00, '/images/case.png', '{"form_factor": "全塔式", "motherboard_support": "E-ATX", "drive_bays": "8个3.5寸", "fan_mounts": "7个120mm"}', true, 25);

-- 插入示例用户数据
INSERT INTO users (username, email, password_hash, display_name) VALUES
('admin', 'admin@buildmaster.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '管理员'),
('testuser', 'test@buildmaster.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '测试用户');

-- 插入示例配置单数据
INSERT INTO build_configs (name, description, total_price, user_id, is_public, created_at) VALUES
('游戏配置单', '适合1080p游戏的入门级配置', 5095.00, 1, true, NOW()),
('高端游戏配置', '适合1440p游戏的高端配置', 9995.00, 1, true, NOW()),
('办公配置单', '适合日常办公的配置', 2999.00, 2, true, NOW());