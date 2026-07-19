-- Allow full access to products and inventory for authenticated users
-- (In a production app, you would restrict this specifically to users where is_admin = true)
CREATE POLICY "Allow authenticated users to insert products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete products" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert variants" ON public.product_variants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update variants" ON public.product_variants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete variants" ON public.product_variants FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert inventory" ON public.inventory FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update inventory" ON public.inventory FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete inventory" ON public.inventory FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert images" ON public.product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update images" ON public.product_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete images" ON public.product_images FOR DELETE USING (auth.role() = 'authenticated');
