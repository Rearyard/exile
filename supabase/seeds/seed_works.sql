-- Insert works for Harry Potter fandom
WITH hp_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '哈利·波特'
),
hp_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM hp_fandom)
),
hp_relations AS (
    SELECT id, name
    FROM public.relation
    WHERE fandom_ids @> ARRAY[(SELECT fandom_id FROM hp_fandom)]
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.work (
    title,
    description,
    type,
    fandoms,
    characters,
    relationships,
    created_by
)
SELECT 
    w.title,
    w.description,
    w.work_type::public.work_type,
    ARRAY[(SELECT fandom_id FROM hp_fandom)],
    ARRAY(
        SELECT id 
        FROM hp_characters 
        WHERE name = ANY(w.character_names)
    ),
    ARRAY(
        SELECT id 
        FROM hp_relations 
        WHERE name = ANY(w.relation_names)
    ),
    u.user_id
FROM (
    VALUES 
        ('作家小W', 
         '霍格沃茨的圣诞节', 
         '圣诞节前夕，哈利和他的朋友们决定留在学校过节。一场突如其来的暴风雪，让这个节日变得格外有趣...', 
         'series',
         ARRAY['哈利·波特', '罗恩·韦斯莱', '赫敏·格兰杰', '德拉科·马尔福'],
         ARRAY['黄金三人组', '学院对头']),
         
        ('画师小A',
         '魔法生物图鉴', 
         '收录了霍格沃茨及禁林中各种神奇生物的手绘图集，包括独角兽、鹰头马身有翼兽等。',
         'post',
         ARRAY['哈利·波特', '卢娜·洛夫古德'],
         ARRAY[]::text[]),
         
        ('翻译小T',
         '魔咒大全：从入门到精通', 
         '一本详尽的魔咒使用指南，包含了从基础咒语到高级魔法的完整教程。',
         'passage',
         ARRAY['赫敏·格兰杰', '西弗勒斯·斯内普'],
         ARRAY['严厉的教授'])
) AS w(
    creator_nickname,
    title,
    description,
    work_type,
    character_names,
    relation_names
)
JOIN users u ON u.nickname = w.creator_nickname;

-- Insert works for LOTR fandom
WITH lotr_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '魔戒'
),
lotr_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM lotr_fandom)
),
lotr_relations AS (
    SELECT id, name
    FROM public.relation
    WHERE fandom_ids @> ARRAY[(SELECT fandom_id FROM lotr_fandom)]
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.work (
    title,
    description,
    type,
    fandoms,
    characters,
    relationships,
    created_by
)
SELECT 
    w.title,
    w.description,
    w.work_type::public.work_type,
    ARRAY[(SELECT fandom_id FROM lotr_fandom)],
    ARRAY(
        SELECT id 
        FROM lotr_characters 
        WHERE name = ANY(w.character_names)
    ),
    ARRAY(
        SELECT id 
        FROM lotr_relations 
        WHERE name = ANY(w.relation_names)
    ),
    u.user_id
FROM (
    VALUES 
        ('作家小W', 
         '精灵之歌', 
         '一个关于莱戈拉斯年轻时代的故事，讲述了他在幽暗密林的冒险。', 
         'series',
         ARRAY['莱戈拉斯', '爱隆'],
         ARRAY['精灵领袖']),
         
        ('画师小A',
         '中土世界风景画集', 
         '一组展现中土世界各地标志性景观的水彩画作品，包括夏尔、瑞文戴尔等地。',
         'post',
         ARRAY['佛罗多·巴金斯', '甘道夫'],
         ARRAY['师徒关系']),
         
        ('翻译小T',
         '矮人工艺集锦', 
         '详细记录了矮人族的锻造技艺和建筑艺术，以及他们的文化传统。',
         'passage',
         ARRAY['金雳'],
         ARRAY[]::text[])
) AS w(
    creator_nickname,
    title,
    description,
    work_type,
    character_names,
    relation_names
)
JOIN users u ON u.nickname = w.creator_nickname;

-- Insert works for Star Wars fandom
WITH sw_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '星球大战'
),
sw_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM sw_fandom)
),
sw_relations AS (
    SELECT id, name
    FROM public.relation
    WHERE fandom_ids @> ARRAY[(SELECT fandom_id FROM sw_fandom)]
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.work (
    title,
    description,
    type,
    fandoms,
    characters,
    relationships,
    created_by
)
SELECT 
    w.title,
    w.description,
    w.work_type::public.work_type,
    ARRAY[(SELECT fandom_id FROM sw_fandom)],
    ARRAY(
        SELECT id 
        FROM sw_characters 
        WHERE name = ANY(w.character_names)
    ),
    ARRAY(
        SELECT id 
        FROM sw_relations 
        WHERE name = ANY(w.relation_names)
    ),
    u.user_id
FROM (
    VALUES 
        ('作家小W', 
         '绝地学徒日记', 
         '讲述了卢克·天行者在尤达大师指导下学习原力的故事。', 
         'series',
         ARRAY['卢克·天行者', '尤达大师'],
         ARRAY['绝地武士']),
         
        ('画师小A',
         '银河英雄画传', 
         '一组描绘星球大战中标志性场景和人物的插画集。',
         'post',
         ARRAY['莱娅公主', '汉·索罗', '丘巴卡'],
         ARRAY['走私团伙']),
         
        ('翻译小T',
         '原力之道：绝地武士守则', 
         '深入探讨绝地武士团的哲学理念和行为准则。',
         'passage',
         ARRAY['尤达大师', '欧比旺·克诺比'],
         ARRAY['绝地武士'])
) AS w(
    creator_nickname,
    title,
    description,
    work_type,
    character_names,
    relation_names
)
JOIN users u ON u.nickname = w.creator_nickname;

-- Insert works for KPOP fandom
WITH kpop_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = 'KPOP'
),
kpop_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM kpop_fandom)
),
kpop_relations AS (
    SELECT id, name
    FROM public.relation
    WHERE fandom_ids @> ARRAY[(SELECT fandom_id FROM kpop_fandom)]
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.work (
    title,
    description,
    type,
    fandoms,
    characters,
    relationships,
    created_by
)
SELECT 
    w.title,
    w.description,
    w.work_type::public.work_type,
    ARRAY[(SELECT fandom_id FROM kpop_fandom)],
    ARRAY(
        SELECT id 
        FROM kpop_characters 
        WHERE name = ANY(w.character_names)
    ),
    ARRAY(
        SELECT id 
        FROM kpop_relations 
        WHERE name = ANY(w.relation_names)
    ),
    u.user_id
FROM (
    VALUES 
        ('作家小W', 
         '练习生日记', 
         '记录了一个练习生的成长历程，从训练到出道的点点滴滴。', 
         'series',
         ARRAY['李马克', '李东赫'],
         ARRAY['【东马】悠悠组合']),
         
        ('画师小A',
         '舞台瞬间', 
         '捕捉偶像们在舞台上最闪耀的瞬间的插画集。',
         'post',
         ARRAY['金泰亨', '朴智旻'],
         ARRAY['【泰智】95z']),
         
        ('翻译小T',
         '韩语学习笔记：通过歌词学韩语', 
         '以流行歌曲歌词为例，教授韩语语法和词汇。',
         'passage',
         ARRAY['田柾国'],
         ARRAY[]::text[])
) AS w(
    creator_nickname,
    title,
    description,
    work_type,
    character_names,
    relation_names
)
JOIN users u ON u.nickname = w.creator_nickname;

-- Insert works for Football fandom
WITH football_fandom AS (
    SELECT id AS fandom_id 
    FROM public.fandom 
    WHERE name = '足球'
),
football_characters AS (
    SELECT id, name
    FROM public.character
    WHERE fandom_id = (SELECT fandom_id FROM football_fandom)
),
football_relations AS (
    SELECT id, name
    FROM public.relation
    WHERE fandom_ids @> ARRAY[(SELECT fandom_id FROM football_fandom)]
),
users AS (
    SELECT user_id, nickname
    FROM public.user_basic
    WHERE nickname IN ('画师小A', '爱读书的小R', '编辑小E', '翻译小T', '评论家小V', '作家小W')
)
INSERT INTO public.work (
    title,
    description,
    type,
    fandoms,
    characters,
    relationships,
    created_by
)
SELECT 
    w.title,
    w.description,
    w.work_type::public.work_type,
    ARRAY[(SELECT fandom_id FROM football_fandom)],
    ARRAY(
        SELECT id 
        FROM football_characters 
        WHERE name = ANY(w.character_names)
    ),
    ARRAY(
        SELECT id 
        FROM football_relations 
        WHERE name = ANY(w.relation_names)
    ),
    u.user_id
FROM (
    VALUES 
        ('作家小W', 
         '球场之外', 
         '讲述球员们在球场之外的故事，展现他们不为人知的一面。', 
         'series',
         ARRAY['梅西', '内马尔'],
         ARRAY['【梅内】南美双星']),
         
        ('画师小A',
         '经典进球时刻', 
         '重现足球历史上那些令人难忘的进球瞬间的插画集。',
         'post',
         ARRAY['C罗', '梅西'],
         ARRAY['【梅C】新老球王']),
         
        ('翻译小T',
         '足球战术解析', 
         '深入分析现代足球战术体系的发展和应用。',
         'passage',
         ARRAY['贝克汉姆', '齐达内'],
         ARRAY['【贝齐】皇马传奇'])
) AS w(
    creator_nickname,
    title,
    description,
    work_type,
    character_names,
    relation_names
)
JOIN users u ON u.nickname = w.creator_nickname; 