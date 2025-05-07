-- Create The Lord of the Rings fandom
WITH editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.fandom (name, created_by, is_official_managed)
SELECT 
    '魔戒',
    user_id,
    true
FROM editor_user
RETURNING id AS fandom_id;

-- Create Star Wars fandom
WITH editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.fandom (name, created_by, is_official_managed)
SELECT 
    '星球大战',
    user_id,
    true
FROM editor_user
RETURNING id AS fandom_id;

-- Insert LOTR characters
WITH lotr_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '魔戒'
),
editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.character (name, created_by, fandom_id)
SELECT 
    character_name,
    editor_user.user_id,
    lotr_fandom.fandom_id
FROM (
    VALUES 
        ('佛罗多·巴金斯'),
        ('甘道夫'),
        ('阿拉贡'),
        ('莱戈拉斯'),
        ('金雳'),
        ('萨鲁曼'),
        ('索伦'),
        ('山姆'),
        ('咕噜'),
        ('爱隆')
) AS characters(character_name)
CROSS JOIN lotr_fandom
CROSS JOIN editor_user;

-- Insert Star Wars characters
WITH sw_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '星球大战'
),
editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.character (name, created_by, fandom_id)
SELECT 
    character_name,
    editor_user.user_id,
    sw_fandom.fandom_id
FROM (
    VALUES 
        ('卢克·天行者'),
        ('莱娅公主'),
        ('汉·索罗'),
        ('达斯·维达'),
        ('尤达大师'),
        ('欧比旺·克诺比'),
        ('帕尔帕廷皇帝'),
        ('丘巴卡'),
        ('安纳金·天行者'),
        ('阿索卡·塔诺')
) AS characters(character_name)
CROSS JOIN sw_fandom
CROSS JOIN editor_user;

-- Insert LOTR relations
WITH lotr_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '魔戒'
),
reader_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '爱读书的小R'
),
lotr_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM lotr_fandom)
)
INSERT INTO public.relation (name, created_by, fandom_ids, characters)
SELECT 
    relation_name,
    reader_user.user_id,
    ARRAY[lotr_fandom.fandom_id],
    ARRAY(
        SELECT id 
        FROM lotr_characters 
        WHERE name = ANY(character_names)
        ORDER BY ARRAY_POSITION(character_names, name)
    )
FROM (
    VALUES 
        ('【佛甘阿莱金】护戒远征队成员', ARRAY['佛罗多·巴金斯', '甘道夫', '阿拉贡', '莱戈拉斯', '金雳']),
        ('【甘佛】长者与学徒', ARRAY['甘道夫', '佛罗多·巴金斯']),
        ('【佛山】生死之交', ARRAY['佛罗多·巴金斯', '山姆']),
        ('【甘萨】巫师之战', ARRAY['甘道夫', '萨鲁曼']),
        ('【爱莱】精灵王族', ARRAY['爱隆', '莱戈拉斯'])
) AS relations(relation_name, character_names)
CROSS JOIN lotr_fandom
CROSS JOIN reader_user;

-- Insert Star Wars relations
WITH sw_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '星球大战'
),
reader_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '爱读书的小R'
),
sw_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM sw_fandom)
)
INSERT INTO public.relation (name, created_by, fandom_ids, characters)
SELECT 
    relation_name,
    reader_user.user_id,
    ARRAY[sw_fandom.fandom_id],
    ARRAY(
        SELECT id 
        FROM sw_characters 
        WHERE name = ANY(character_names)
        ORDER BY ARRAY_POSITION(character_names, name)
    )
FROM (
    VALUES 
        ('【卢莱安】天行者血脉', ARRAY['卢克·天行者', '莱娅公主', '安纳金·天行者']),
        ('【欧安】师徒之谊', ARRAY['欧比旺·克诺比', '安纳金·天行者']),
        ('【达帕】帝国双尊', ARRAY['达斯·维达', '帕尔帕廷皇帝']),
        ('【尤欧卢】绝地传承', ARRAY['尤达大师', '欧比旺·克诺比', '卢克·天行者']),
        ('【汉丘】亡命之交', ARRAY['汉·索罗', '丘巴卡'])
) AS relations(relation_name, character_names)
CROSS JOIN sw_fandom
CROSS JOIN reader_user;

-- Create fandom subscriptions
WITH fandoms AS (
    SELECT id AS fandom_id, name
    FROM public.fandom
    WHERE name IN ('魔戒', '星球大战', '哈利·波特')
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.fandom_subscription (fandom_id, user_id)
SELECT DISTINCT f.fandom_id, u.user_id
FROM (
    VALUES 
        -- 爱读书的小R订阅所有作品
        ('爱读书的小R', '魔戒'),
        ('爱读书的小R', '星球大战'),
        ('爱读书的小R', '哈利·波特'),
        
        -- 作家小W订阅魔幻作品
        ('作家小W', '魔戒'),
        ('作家小W', '哈利·波特'),
        
        -- 画师小A订阅科幻作品
        ('画师小A', '星球大战'),
        
        -- 编辑小E作为管理员订阅所有
        ('编辑小E', '魔戒'),
        ('编辑小E', '星球大战'),
        ('编辑小E', '哈利·波特'),
        
        -- 翻译小T订阅外语作品
        ('翻译小T', '魔戒'),
        ('翻译小T', '星球大战'),
        
        -- 评论家小V订阅热门作品
        ('评论家小V', '星球大战'),
        ('评论家小V', '哈利·波特')
) AS subscriptions(user_nickname, fandom_name)
JOIN users u ON u.nickname = subscriptions.user_nickname
JOIN fandoms f ON f.name = subscriptions.fandom_name; 