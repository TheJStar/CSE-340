INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) 
VALUES ('Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n');

UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM public.account  WHERE account_id = 1;

UPDATE public.inventory 
SET inv_description = REPLACE(inventory.inv_description, 'a huge interior', 'small interiors') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT inv_make, inv_model FROM public.inventory
INNER JOIN public.classification
	ON inv_model = classification_name
WHERE classification_name = 'Sport';

UPDATE public.inventory SET inv_image = REPLACE(inventory.inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE(inventory.inv_thumbnail, '/images', '/images/vehicles');