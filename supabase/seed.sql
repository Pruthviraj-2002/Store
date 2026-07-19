-- Supabase Seed Data for E-Commerce App

-- 1. Insert Brands
INSERT INTO public.brands (name) VALUES 
('Arduino'),
('Espressif Systems'),
('YAGEO'),
('KEMET')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Categories
INSERT INTO public.categories (name, slug) VALUES 
('Development Boards', 'development-boards'),
('Passive Components', 'passive-components')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products & Relations
DO $$
DECLARE
    arduino_brand_id UUID;
    espressif_brand_id UUID;
    yageo_brand_id UUID;
    kemet_brand_id UUID;
    dev_board_cat_id UUID;
    passive_cat_id UUID;

    prod_id UUID;
    var_id UUID;
BEGIN
    SELECT id INTO arduino_brand_id FROM public.brands WHERE name = 'Arduino';
    SELECT id INTO espressif_brand_id FROM public.brands WHERE name = 'Espressif Systems';
    SELECT id INTO yageo_brand_id FROM public.brands WHERE name = 'YAGEO';
    SELECT id INTO kemet_brand_id FROM public.brands WHERE name = 'KEMET';
    
    SELECT id INTO dev_board_cat_id FROM public.categories WHERE slug = 'development-boards';
    SELECT id INTO passive_cat_id FROM public.categories WHERE slug = 'passive-components';

    -- Product 1: Arduino Uno R3
    INSERT INTO public.products (brand_id, category_id, name, slug, short_description)
    VALUES (arduino_brand_id, dev_board_cat_id, 'Arduino Uno R3', 'arduino-uno-r3', 'ATmega328P Microcontroller Board')
    RETURNING id INTO prod_id;
    
    INSERT INTO public.product_variants (product_id, sku, base_price, sale_price)
    VALUES (prod_id, 'ARD-UNO-R3', 950.00, 850.00)
    RETURNING id INTO var_id;
    
    INSERT INTO public.inventory (variant_id, quantity) VALUES (var_id, 50);
    INSERT INTO public.product_images (product_id, url) VALUES (prod_id, 'https://images.unsplash.com/photo-1559819614-81fea9efd090?w=600&q=80');

    -- Product 2: ESP32 NodeMCU
    INSERT INTO public.products (brand_id, category_id, name, slug, short_description)
    VALUES (espressif_brand_id, dev_board_cat_id, 'ESP32 NodeMCU', 'esp32-nodemcu', 'Wi-Fi & Bluetooth MCU')
    RETURNING id INTO prod_id;
    
    INSERT INTO public.product_variants (product_id, sku, base_price)
    VALUES (prod_id, 'ESP-32-DEV', 399.00)
    RETURNING id INTO var_id;
    
    INSERT INTO public.inventory (variant_id, quantity) VALUES (var_id, 300);
    INSERT INTO public.product_images (product_id, url) VALUES (prod_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80');

    -- Product 3: 10K Resistor
    INSERT INTO public.products (brand_id, category_id, name, slug, short_description)
    VALUES (yageo_brand_id, passive_cat_id, '10k Ohm 1/4W Resistor (Pack of 100)', '10k-resistor-pack', '1/4W Through Hole Resistor')
    RETURNING id INTO prod_id;
    
    INSERT INTO public.product_variants (product_id, sku, base_price)
    VALUES (prod_id, 'RES-10K-14W', 45.00)
    RETURNING id INTO var_id;
    
    INSERT INTO public.inventory (variant_id, quantity) VALUES (var_id, 200);
    INSERT INTO public.product_images (product_id, url) VALUES (prod_id, 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80');

    -- Product 4: 10uF Capacitor
    INSERT INTO public.products (brand_id, category_id, name, slug, short_description)
    VALUES (kemet_brand_id, passive_cat_id, '10uF Capacitor', '10uf-capacitor', 'Ceramic Capacitor')
    RETURNING id INTO prod_id;
    
    INSERT INTO public.product_variants (product_id, sku, base_price)
    VALUES (prod_id, 'CAP-10UF-CER', 2.50)
    RETURNING id INTO var_id;
    
    INSERT INTO public.inventory (variant_id, quantity) VALUES (var_id, 5000);
    INSERT INTO public.product_images (product_id, url) VALUES (prod_id, 'https://images.unsplash.com/photo-1580828343064-fde4cad202d5?w=300&q=80');
END $$;
