-- Create KPOP fandom
WITH editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.fandom (name, created_by, is_official_managed, is_rps)
SELECT 
    'KPOP',
    user_id,
    true,
    true
FROM editor_user
RETURNING id AS fandom_id;

-- Create Football fandom
WITH editor_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '编辑小E'
)
INSERT INTO public.fandom (name, created_by, is_official_managed, is_rps)
SELECT 
    '足球',
    user_id,
    true,
    true
FROM editor_user
RETURNING id AS fandom_id;

-- Insert KPOP characters (idols)
WITH kpop_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = 'KPOP'
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
    kpop_fandom.fandom_id
FROM (
    VALUES 
        ('金泰亨'),  -- V/BTS
        ('朴智旻'),  -- Jimin/BTS
        ('田柾国'),  -- Jungkook/BTS
        ('李帝努'),  -- Jeno/NCT
        ('罗渽民'),  -- Jaemin/NCT
        ('黄仁俊'),  -- Renjun/NCT
        ('李东赫'),  -- Haechan/NCT
        ('李马克'),  -- Mark/NCT
        ('李楷灿'),  -- Haechan本名
        ('李敏浩')   -- Lee Know/Stray Kids
) AS characters(character_name)
CROSS JOIN kpop_fandom
CROSS JOIN editor_user;

-- Insert Football characters (players)
WITH football_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '足球'
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
    football_fandom.fandom_id
FROM (
    VALUES 
        ('梅西'),
        ('C罗'),
        ('内马尔'),
        ('姆巴佩'),
        ('哈兰德'),
        ('贝克汉姆'),
        ('齐达内'),
        ('罗纳尔多'),
        ('卡卡'),
        ('劳尔')
) AS characters(character_name)
CROSS JOIN football_fandom
CROSS JOIN editor_user;

-- Insert KPOP relations
WITH kpop_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = 'KPOP'
),
reader_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '爱读书的小R'
),
kpop_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM kpop_fandom)
)
INSERT INTO public.relation (name, created_by, fandom_ids, characters)
SELECT 
    relation_name,
    reader_user.user_id,
    ARRAY[kpop_fandom.fandom_id],
    ARRAY(
        SELECT id 
        FROM kpop_characters 
        WHERE name = ANY(character_names)
        ORDER BY ARRAY_POSITION(character_names, name)
    )
FROM (
    VALUES 
        ('【泰智】95z', ARRAY['金泰亨', '朴智旻']),
        ('【智国】黄金忙内', ARRAY['朴智旻', '田柾国']),
        ('【帝渽】诺民', ARRAY['李帝努', '罗渽民']),
        ('【东马】悠悠组合', ARRAY['李东赫', '李马克']),
        ('【仁东】00z', ARRAY['黄仁俊', '李东赫'])
) AS relations(relation_name, character_names)
CROSS JOIN kpop_fandom
CROSS JOIN reader_user;

-- Insert Football relations
WITH football_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '足球'
),
reader_user AS (
    SELECT user_id 
    FROM public.user_basic 
    WHERE nickname = '爱读书的小R'
),
football_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM football_fandom)
)
INSERT INTO public.relation (name, created_by, fandom_ids, characters)
SELECT 
    relation_name,
    reader_user.user_id,
    ARRAY[football_fandom.fandom_id],
    ARRAY(
        SELECT id 
        FROM football_characters 
        WHERE name = ANY(character_names)
        ORDER BY ARRAY_POSITION(character_names, name)
    )
FROM (
    VALUES 
        ('【梅C】新老球王', ARRAY['梅西', 'C罗']),
        ('【内姆】巴黎双子星', ARRAY['内马尔', '姆巴佩']),
        ('【贝齐】皇马传奇', ARRAY['贝克汉姆', '齐达内']),
        ('【罗卡】米兰王子', ARRAY['罗纳尔多', '卡卡']),
        ('【梅内】南美双星', ARRAY['梅西', '内马尔'])
) AS relations(relation_name, character_names)
CROSS JOIN football_fandom
CROSS JOIN reader_user;

-- Create fandom subscriptions for RPS
WITH fandoms AS (
    SELECT id AS fandom_id, name
    FROM public.fandom
    WHERE name IN ('KPOP', '足球')
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
        -- 爱读书的小R关注所有
        ('爱读书的小R', 'KPOP'),
        ('爱读书的小R', '足球'),
        
        -- 画师小A关注KPOP
        ('画师小A', 'KPOP'),
        
        -- 编辑小E作为管理员关注所有
        ('编辑小E', 'KPOP'),
        ('编辑小E', '足球'),
        
        -- 评论家小V关注热门话题
        ('评论家小V', 'KPOP'),
        ('评论家小V', '足球')
) AS subscriptions(user_nickname, fandom_name)
JOIN users u ON u.nickname = subscriptions.user_nickname
JOIN fandoms f ON f.name = subscriptions.fandom_name; 