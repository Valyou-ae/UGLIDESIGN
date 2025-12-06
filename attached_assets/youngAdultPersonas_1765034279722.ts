/**
 * PHASE 1: YOUNG ADULT PERSONAS (Ages 18-29)
 * 
 * This file contains 112 unified Young Adult personas covering:
 * - 56 Young Adult Female personas (8 ethnicities × 7 sizes)
 * - 56 Young Adult Male personas (8 ethnicities × 7 sizes)
 * 
 * Version: 1.0
 * Date: December 4, 2024
 */
import { Sex, Ethnicity, UnifiedPersona } from '../../types';

type YoungAdultPersonaData = Partial<Record<Sex, Partial<Record<Ethnicity, Partial<Record<string, UnifiedPersona[]>>>>>>;

export const YOUNG_ADULT_PERSONAS: YoungAdultPersonaData = {
  'Female': {
    'White': {
      'XS': [{
        id: 'WHT_YA_F_XS_001', name: 'Emma', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: 'XS',
        height: '158cm (5\'2")', weight: '48kg (106lbs)', build: 'Petite athletic frame',
        facialFeatures: 'Delicate oval face with youthful features, bright blue eyes, clear smooth skin, defined cheekbones, small nose',
        hairStyle: 'Long straight with soft layers', hairColor: 'Light blonde', eyeColor: 'Blue', skinTone: 'Fair with rosy undertones',
        fullDescription: 'Emma is a young White woman in her early 20s, standing 158cm (5\'2") tall and weighing approximately 48kg (106lbs). She has a petite, athletic frame with narrow shoulders, toned slender arms, flat stomach with visible definition, small bust (A cup), narrow hips, and toned legs from regular yoga. Her face is delicately oval with youthful features, bright blue eyes full of energy, clear smooth skin with natural glow, defined cheekbones, and a small refined nose. She wears her light blonde hair long and straight with soft layers. Her skin is fair with healthy rosy undertones. Emma embodies youthful vitality and natural fitness.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'WHT_YA_F_S_001', name: 'Olivia', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: 'S',
        height: '163cm (5\'4")', weight: '54kg (119lbs)', build: 'Slim athletic build',
        facialFeatures: 'Heart-shaped face with youthful radiance, green eyes, flawless skin, elegant features, symmetrical beauty',
        hairStyle: 'Medium length wavy bob', hairColor: 'Honey blonde', eyeColor: 'Green', skinTone: 'Light with warm glow',
        fullDescription: 'Olivia is a young White woman in her mid-20s, standing 163cm (5\'4") tall and weighing approximately 54kg (119lbs). She has a slim, athletic build with toned shoulders, defined arms from gym workouts, flat stomach with slight ab definition, small to medium bust (B cup), slim waist, and athletic legs. Her face is heart-shaped with youthful radiance, sparkling green eyes, flawless smooth skin, elegant refined features, and natural symmetrical beauty. She wears her honey blonde hair in a medium-length wavy bob. Her skin is light with a warm healthy glow. Olivia represents the modern active young woman.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'WHT_YA_F_M_001', name: 'Sophia', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: 'M',
        height: '168cm (5\'6")', weight: '61kg (134lbs)', build: 'Balanced athletic physique',
        facialFeatures: 'Oval face with mature beauty, hazel eyes, smooth complexion, defined features, natural confidence',
        hairStyle: 'Long layered waves', hairColor: 'Dark blonde', eyeColor: 'Hazel', skinTone: 'Medium fair',
        fullDescription: 'Sophia is a young White woman in her late 20s, standing 168cm (5\'6") tall and weighing approximately 61kg (134lbs). She has a balanced, athletic physique with proportioned shoulders, toned arms with feminine definition, flat stomach with natural softness, medium bust (C cup), defined waist, moderate hips, and strong shapely legs. Her face is oval with mature beauty, expressive hazel eyes, smooth clear complexion, well-defined features, and natural confidence in her expression. She wears her dark blonde hair in long layered waves. Her skin is medium fair with even tone. Sophia exemplifies healthy young adult femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'WHT_YA_F_L_001', name: 'Ava', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: 'L',
        height: '170cm (5\'7")', weight: '70kg (154lbs)', build: 'Curvy athletic build',
        facialFeatures: 'Round face with soft features, blue-green eyes, clear skin, full cheeks, warm expression',
        hairStyle: 'Long straight center part', hairColor: 'Light brown', eyeColor: 'Blue-green', skinTone: 'Fair to medium',
        fullDescription: 'Ava is a young White woman in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 70kg (154lbs). She has a curvy, athletic build with broader shoulders, fuller arms with good muscle tone, soft stomach with natural curves, fuller bust (D cup), defined waist, wider hips with curves, and strong thick thighs. Her face is round with soft approachable features, striking blue-green eyes, clear healthy skin, full feminine cheeks, and a naturally warm expression. She wears her light brown hair long and straight with a center part. Her skin tone ranges from fair to medium. Ava represents strong, curvaceous young femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'WHT_YA_F_XL_001', name: 'Mia', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: 'XL',
        height: '173cm (5\'8")', weight: '82kg (181lbs)', build: 'Full-figured with strength',
        facialFeatures: 'Round full face with youthful softness, brown eyes, smooth skin, prominent cheeks, friendly features',
        hairStyle: 'Shoulder-length with volume', hairColor: 'Auburn', eyeColor: 'Brown', skinTone: 'Light with pink undertones',
        fullDescription: 'Mia is a young White woman in her early 20s, standing 173cm (5\'8") tall and weighing approximately 82kg (181lbs). She has a full-figured build with strength, wide shoulders with substance, full arms with underlying strength, rounded stomach with natural fullness, large bust (DD cup), thick waist, wide full hips, and substantial thighs with power. Her face is round and full with youthful softness, warm brown eyes, smooth clear skin despite size, prominent full cheeks, and naturally friendly features. She wears her auburn hair at shoulder-length with natural volume. Her skin is light with healthy pink undertones. Mia embodies confident full-figured youth.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'WHT_YA_F_2XL_001', name: 'Charlotte', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: '2XL',
        height: '175cm (5\'9")', weight: '95kg (209lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, blue eyes, smooth youthful skin, soft features, gentle expression',
        hairStyle: 'Long curly voluminous', hairColor: 'Blonde', eyeColor: 'Blue', skinTone: 'Fair',
        fullDescription: 'Charlotte is a young White woman in her late 20s, standing 175cm (5\'9") tall and weighing approximately 95kg (209lbs). She has a plus-size build with commanding presence, broad shoulders, full thick arms, prominent rounded stomach, very large bust (DDD/F cup), thick substantial waist, wide full hips with volume, and heavy thick thighs. Her face is full and round, bright blue eyes that sparkle with life, smooth youthful skin despite her size, soft rounded features, and a gentle welcoming expression. She wears her blonde hair long and curly with natural volume. Her skin is fair with even tone. Charlotte represents confident plus-size youth.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'WHT_YA_F_3XL_001', name: 'Amelia', age: 'Young Adult', sex: 'Female', ethnicity: 'White', size: '3XL',
        height: '170cm (5\'7")', weight: '110kg (243lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, green eyes, clear young skin, pronounced fullness, warm features',
        hairStyle: 'Medium length styled', hairColor: 'Red', eyeColor: 'Green', skinTone: 'Fair with freckles',
        fullDescription: 'Amelia is a young White woman in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 110kg (243lbs). She has a full-bodied build retaining youthful energy, very broad shoulders, very full thick arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips with substantial curves, and very heavy thighs. Her face is very full and round, striking green eyes, remarkably clear young skin, pronounced facial fullness, and naturally warm welcoming features. She wears her red hair at medium length with careful styling. Her fair skin has natural freckles. Amelia embodies youthful confidence at any size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Black': {
      'XS': [{
        id: 'BLK_YA_F_XS_001', name: 'Zara', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: 'XS',
        height: '160cm (5\'3")', weight: '50kg (110lbs)', build: 'Petite toned frame',
        facialFeatures: 'Delicate features with natural beauty, dark brown eyes, smooth rich skin, high cheekbones, small nose',
        hairStyle: 'Natural short curls', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Deep brown',
        fullDescription: 'Zara is a young Black woman in her early 20s, standing 160cm (5\'3") tall and weighing approximately 50kg (110lbs). She has a petite, toned frame with narrow shoulders, slim toned arms, flat defined stomach, small bust (A cup), narrow hips with slight curve, and lean athletic legs. Her face shows delicate features with natural beauty, expressive dark brown eyes, smooth rich melanin skin with healthy glow, high prominent cheekbones, and a small refined nose. She wears her natural black hair in short textured curls. Her skin is a beautiful deep brown. Zara embodies petite Black beauty and strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'BLK_YA_F_S_001', name: 'Nia', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: 'S',
        height: '165cm (5\'5")', weight: '56kg (123lbs)', build: 'Slim with natural curves',
        facialFeatures: 'Elegant oval face, dark eyes, flawless melanin skin, sculpted cheekbones, full lips',
        hairStyle: 'Long box braids', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium brown',
        fullDescription: 'Nia is a young Black woman in her mid-20s, standing 165cm (5\'5") tall and weighing approximately 56kg (123lbs). She has a slim build with natural curves, toned shoulders, defined arms with feminine grace, flat stomach with subtle definition, small to medium bust (B cup), defined waist, moderate hips with natural curve, and toned shapely legs. Her face is elegantly oval, deep dark eyes full of intelligence, flawless melanin-rich skin, beautifully sculpted cheekbones, and full expressive lips. She wears long box braids in her black hair. Her skin is a rich medium brown. Nia represents modern Black elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'BLK_YA_F_M_001', name: 'Maya', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: 'M',
        height: '168cm (5\'6")', weight: '63kg (139lbs)', build: 'Balanced curvy athletic',
        facialFeatures: 'Round face with striking features, brown eyes, radiant skin, full cheeks, confident expression',
        hairStyle: 'Natural afro', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Dark brown',
        fullDescription: 'Maya is a young Black woman in her late 20s, standing 168cm (5\'6") tall and weighing approximately 63kg (139lbs). She has a balanced, curvy athletic build with proportioned shoulders, toned arms with definition, flat stomach with natural softness, medium to full bust (C cup), defined waist, curvy hips, and strong athletic legs with curves. Her face is round with striking natural features, warm brown eyes, radiant glowing melanin skin, full expressive cheeks, and a naturally confident expression. She wears her black hair in a beautiful natural afro. Her skin is a gorgeous dark brown. Maya exemplifies Black feminine strength and beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'BLK_YA_F_L_001', name: 'Aaliyah', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: 'L',
        height: '170cm (5\'7")', weight: '72kg (159lbs)', build: 'Curvaceous strong build',
        facialFeatures: 'Full face with beauty, dark expressive eyes, smooth rich skin, prominent features, warm smile',
        hairStyle: 'Long wavy weave', hairColor: 'Black with brown highlights', eyeColor: 'Dark brown', skinTone: 'Deep chocolate',
        fullDescription: 'Aaliyah is a young Black woman in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 72kg (159lbs). She has a curvaceous, strong build with broad shoulders, fuller arms with good tone, soft stomach with curves, full bust (D cup), defined thick waist, wide shapely hips, and thick powerful thighs. Her face is full with natural beauty, dark expressive eyes that captivate, smooth rich melanin skin, prominent striking features, and a warm inviting smile. She wears long wavy weave in black with brown highlights. Her skin is a deep chocolate tone. Aaliyah represents curvaceous Black beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'BLK_YA_F_XL_001', name: 'Imani', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: 'XL',
        height: '173cm (5\'8")', weight: '85kg (187lbs)', build: 'Full-figured with power',
        facialFeatures: 'Round full face, beautiful dark eyes, glowing skin, full features, radiant presence',
        hairStyle: 'Protective cornrows', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich ebony',
        fullDescription: 'Imani is a young Black woman in her early 20s, standing 173cm (5\'8") tall and weighing approximately 85kg (187lbs). She has a full-figured build with physical power, wide shoulders, full arms with strength, rounded stomach with volume, large bust (DD cup), thick waist, wide full hips with curves, and substantial strong thighs. Her face is round and full, beautiful dark eyes that shine, glowing healthy melanin skin, full striking features, and a radiant confident presence. She wears protective cornrows in her black hair. Her skin is a rich ebony tone. Imani embodies strong Black feminine confidence.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'BLK_YA_F_2XL_001', name: 'Keisha', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: '2XL',
        height: '175cm (5\'9")', weight: '98kg (216lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, expressive eyes, beautiful melanin skin, soft features, welcoming smile',
        hairStyle: 'Long straight weave', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Dark brown',
        fullDescription: 'Keisha is a young Black woman in her late 20s, standing 175cm (5\'9") tall and weighing approximately 98kg (216lbs). She has a plus-size build with commanding presence, broad substantial shoulders, full thick arms, prominent stomach, very large bust (DDD/F cup), thick waist with volume, wide full hips, and heavy thick thighs with power. Her face is full and round, expressive eyes full of life, beautiful glowing melanin skin, soft rounded features, and a welcoming bright smile. She wears long straight weave in black. Her skin is a deep dark brown. Keisha represents confident plus-size Black beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'BLK_YA_F_3XL_001', name: 'Destiny', age: 'Young Adult', sex: 'Female', ethnicity: 'Black', size: '3XL',
        height: '170cm (5\'7")', weight: '112kg (247lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, warm eyes, radiant skin, pronounced fullness, joyful expression',
        hairStyle: 'Medium length curly weave', hairColor: 'Black with burgundy', eyeColor: 'Dark brown', skinTone: 'Deep ebony',
        fullDescription: 'Destiny is a young Black woman in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 112kg (247lbs). She has a full-bodied build with youthful energy, very broad shoulders, very full arms, large stomach with prominence, extra-large bust (G+ cup), very thick waist, very wide hips with substantial volume, and very heavy powerful thighs. Her face is very full and round, warm inviting eyes, radiant glowing melanin skin, pronounced facial fullness, and a naturally joyful expression. She wears medium-length curly weave in black with burgundy highlights. Her skin is a gorgeous deep ebony. Destiny embodies Black beauty at every size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Hispanic': {
      'XS': [{
        id: 'HIS_YA_F_XS_001', name: 'Sofia', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: 'XS',
        height: '157cm (5\'2")', weight: '49kg (108lbs)', build: 'Petite curvy frame',
        facialFeatures: 'Heart-shaped face with Latin beauty, dark brown eyes, smooth olive skin, delicate features',
        hairStyle: 'Long dark waves', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Medium olive',
        fullDescription: 'Sofia is a young Hispanic woman in her early 20s, standing 157cm (5\'2") tall and weighing approximately 49kg (108lbs). She has a petite curvy frame with narrow shoulders, slim toned arms, flat stomach with slight curves, small bust with natural fullness (A/B cup), narrow waist, hips with natural curve despite size, and toned legs with feminine shape. Her face is heart-shaped with Latin beauty, expressive dark brown eyes, smooth olive-toned skin, delicate refined features. She wears her dark brown hair in long flowing waves. Her skin has a beautiful medium olive tone. Sofia embodies petite Latina beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'HIS_YA_F_S_001', name: 'Isabella', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: 'S',
        height: '162cm (5\'4")', weight: '55kg (121lbs)', build: 'Slim naturally curvy',
        facialFeatures: 'Oval face with Latina features, brown eyes, radiant skin, high cheekbones, full lips',
        hairStyle: 'Long straight with bangs', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Tan',
        fullDescription: 'Isabella is a young Hispanic woman in her mid-20s, standing 162cm (5\'4") tall and weighing approximately 55kg (121lbs). She has a slim, naturally curvy build with toned shoulders, defined arms, flat stomach with feminine softness, small to medium bust (B cup), defined waist, moderate hips with natural curves, and shapely toned legs. Her face is oval with classic Latina features, warm brown eyes, radiant glowing skin, high striking cheekbones, and full sensual lips. She wears her black hair long and straight with stylish bangs. Her skin has a beautiful tan. Isabella represents modern Latina elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'HIS_YA_F_M_001', name: 'Valentina', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: 'M',
        height: '165cm (5\'5")', weight: '62kg (137lbs)', build: 'Balanced curvy figure',
        facialFeatures: 'Round face with warmth, dark eyes, smooth complexion, full features, natural beauty',
        hairStyle: 'Medium length layered', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Medium brown',
        fullDescription: 'Valentina is a young Hispanic woman in her late 20s, standing 165cm (5\'5") tall and weighing approximately 62kg (137lbs). She has a balanced, curvy figure with proportioned shoulders, toned arms with softness, soft stomach with natural curves, medium to full bust (C cup), defined waist, curvy hips, and strong shapely legs. Her face is round with natural warmth, expressive dark eyes, smooth glowing complexion, full feminine features, and natural Latina beauty. She wears her dark brown hair in medium-length layers. Her skin is a medium brown. Valentina exemplifies classic Latina curves.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'HIS_YA_F_L_001', name: 'Camila', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: 'L',
        height: '168cm (5\'6")', weight: '71kg (156lbs)', build: 'Voluptuous strong build',
        facialFeatures: 'Full face with beauty, brown eyes, radiant skin, prominent features, confident smile',
        hairStyle: 'Long curly thick', hairColor: 'Dark brown with caramel', eyeColor: 'Brown', skinTone: 'Golden brown',
        fullDescription: 'Camila is a young Hispanic woman in her mid-20s, standing 168cm (5\'6") tall and weighing approximately 71kg (156lbs). She has a voluptuous, strong build with broader shoulders, fuller arms with tone, soft stomach with curves, full bust (D cup), thick waist, wide shapely hips, and thick powerful thighs. Her face is full with natural beauty, warm brown eyes, radiant healthy skin, prominent striking features, and a confident bright smile. She wears her dark brown hair long and curly with caramel highlights. Her skin is a golden brown. Camila represents voluptuous Latina beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'HIS_YA_F_XL_001', name: 'Lucia', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: 'XL',
        height: '170cm (5\'7")', weight: '84kg (185lbs)', build: 'Full-figured with curves',
        facialFeatures: 'Round full face, dark expressive eyes, smooth skin, full cheeks, warm presence',
        hairStyle: 'Shoulder-length wavy', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich tan',
        fullDescription: 'Lucia is a young Hispanic woman in her early 20s, standing 170cm (5\'7") tall and weighing approximately 84kg (185lbs). She has a full-figured build with pronounced curves, wide shoulders, full arms with strength, rounded stomach with volume, large bust (DD cup), thick waist, wide full hips with dramatic curves, and substantial thick thighs. Her face is round and full, dark expressive eyes, smooth healthy skin, full feminine cheeks, and a warm welcoming presence. She wears her black hair at shoulder-length with natural waves. Her skin is a rich tan. Lucia embodies full-figured Latina confidence.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'HIS_YA_F_2XL_001', name: 'Gabriela', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: '2XL',
        height: '173cm (5\'8")', weight: '97kg (214lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, beautiful eyes, glowing complexion, soft features, radiant smile',
        hairStyle: 'Long straight sleek', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Medium tan',
        fullDescription: 'Gabriela is a young Hispanic woman in her late 20s, standing 173cm (5\'8") tall and weighing approximately 97kg (214lbs). She has a plus-size build with commanding presence, broad shoulders, full thick arms, prominent rounded stomach, very large bust (DDD/F cup), thick substantial waist, wide full hips with volume, and heavy thick thighs. Her face is full and round, beautiful warm eyes, glowing healthy complexion, soft rounded features, and a radiant confident smile. She wears her dark brown hair long straight and sleek. Her skin is a medium tan. Gabriela represents confident plus-size Latina beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'HIS_YA_F_3XL_001', name: 'Rosa', age: 'Young Adult', sex: 'Female', ethnicity: 'Hispanic', size: '3XL',
        height: '168cm (5\'6")', weight: '111kg (245lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, expressive eyes, smooth skin, pronounced fullness, joyful features',
        hairStyle: 'Medium curly styled', hairColor: 'Black with red tones', eyeColor: 'Dark brown', skinTone: 'Deep tan',
        fullDescription: 'Rosa is a young Hispanic woman in her mid-20s, standing 168cm (5\'6") tall and weighing approximately 111kg (245lbs). She has a full-bodied build retaining youthful energy, very broad shoulders, very full thick arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips with substantial curves, and very heavy thighs. Her face is very full and round, expressive warm eyes, remarkably smooth skin, pronounced facial fullness, and naturally joyful features. She wears her black hair with red tones in medium-length curls. Her skin is a deep tan. Rosa embodies Latina beauty at any size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Asian': {
      'XS': [{
        id: 'ASN_YA_F_XS_001', name: 'Mei', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: 'XS',
        height: '155cm (5\'1")', weight: '46kg (101lbs)', build: 'Petite delicate frame',
        facialFeatures: 'Small oval face with Asian features, dark almond eyes, porcelain skin, delicate bone structure',
        hairStyle: 'Long straight black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Light porcelain',
        fullDescription: 'Mei is a young Asian woman in her early 20s, standing 155cm (5\'1") tall and weighing approximately 46kg (101lbs). She has a petite, delicate frame with narrow shoulders, very slim arms, flat stomach with minimal curves, small bust (A cup), narrow hips, and slender legs. Her face is small and oval with classic Asian features, beautiful dark almond-shaped eyes, flawless porcelain skin, delicate refined bone structure. She wears her black hair long and straight. Her skin is light porcelain. Mei embodies delicate Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'ASN_YA_F_S_001', name: 'Yuki', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: 'S',
        height: '160cm (5\'3")', weight: '52kg (115lbs)', build: 'Slim graceful build',
        facialFeatures: 'Oval face with elegance, dark eyes, smooth clear skin, refined features, natural grace',
        hairStyle: 'Medium length with soft waves', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Light with warm undertones',
        fullDescription: 'Yuki is a young Asian woman in her mid-20s, standing 160cm (5\'3") tall and weighing approximately 52kg (115lbs). She has a slim, graceful build with narrow shoulders, slender toned arms, flat stomach with subtle definition, small to medium bust (A/B cup), defined waist, slim hips with gentle curves, and toned slender legs. Her face is oval with natural elegance, expressive dark eyes, smooth clear skin, refined delicate features, and innate grace. She wears her dark brown hair at medium length with soft waves. Her skin is light with warm undertones. Yuki represents modern Asian elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'ASN_YA_F_M_001', name: 'Li Wei', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: 'M',
        height: '163cm (5\'4")', weight: '58kg (128lbs)', build: 'Balanced proportionate figure',
        facialFeatures: 'Round face with youthful features, dark eyes, clear complexion, soft features, natural beauty',
        hairStyle: 'Long layered black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium with golden undertones',
        fullDescription: 'Li Wei is a young Asian woman in her late 20s, standing 163cm (5\'4") tall and weighing approximately 58kg (128lbs). She has a balanced, proportionate figure with moderate shoulders, toned arms, flat stomach with natural softness, medium bust (B cup), defined waist, moderate hips, and shapely legs. Her face is round with youthful features, warm dark eyes, clear healthy complexion, soft feminine features, and natural Asian beauty. She wears her black hair long with layers. Her skin is medium with golden undertones. Li Wei exemplifies balanced Asian femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'ASN_YA_F_L_001', name: 'Hana', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: 'L',
        height: '165cm (5\'5")', weight: '68kg (150lbs)', build: 'Fuller curvy build',
        facialFeatures: 'Round full face, dark eyes, smooth skin, full cheeks, warm expression',
        hairStyle: 'Shoulder-length wavy', hairColor: 'Dark brown with highlights', eyeColor: 'Dark brown', skinTone: 'Tan',
        fullDescription: 'Hana is a young Asian woman in her mid-20s, standing 165cm (5\'5") tall and weighing approximately 68kg (150lbs). She has a fuller, curvy build with broader shoulders, fuller arms, soft stomach with curves, full bust (C/D cup), thick waist, wider hips with curves, and thick shapely thighs. Her face is round and full, expressive dark eyes, smooth healthy skin, full feminine cheeks, and a warm approachable expression. She wears her dark brown hair with highlights at shoulder-length with waves. Her skin is tan. Hana represents fuller-figured Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'ASN_YA_F_XL_001', name: 'Ji-won', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: 'XL',
        height: '168cm (5\'6")', weight: '80kg (176lbs)', build: 'Full-figured with strength',
        facialFeatures: 'Round full face, dark eyes, smooth complexion, full features, confident presence',
        hairStyle: 'Long straight black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Light to medium',
        fullDescription: 'Ji-won is a young Asian woman in her early 20s, standing 168cm (5\'6") tall and weighing approximately 80kg (176lbs). She has a full-figured build with underlying strength, wide shoulders, full arms, rounded stomach with volume, large bust (DD cup), thick waist, wide hips with fullness, and substantial thighs. Her face is round and full, beautiful dark eyes, smooth clear complexion, full striking features, and confident self-assured presence. She wears her black hair long and straight. Her skin ranges from light to medium. Ji-won embodies confident full-figured Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'ASN_YA_F_2XL_001', name: 'Sakura', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: '2XL',
        height: '170cm (5\'7")', weight: '93kg (205lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, gentle eyes, smooth skin, soft features, serene expression',
        hairStyle: 'Medium length styled', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Medium',
        fullDescription: 'Sakura is a young Asian woman in her late 20s, standing 170cm (5\'7") tall and weighing approximately 93kg (205lbs). She has a plus-size build with gentle presence, broad shoulders, full thick arms, prominent stomach, very large bust (DDD/F cup), thick waist, wide full hips, and heavy thighs. Her face is full and round, gentle kind eyes, remarkably smooth skin, soft rounded features, and a naturally serene expression. She wears her dark brown hair at medium length with styling. Her skin is medium-toned. Sakura represents plus-size Asian grace.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'ASN_YA_F_3XL_001', name: 'Lian', age: 'Young Adult', sex: 'Female', ethnicity: 'Asian', size: '3XL',
        height: '165cm (5\'5")', weight: '108kg (238lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, warm eyes, clear skin, pronounced fullness, peaceful features',
        hairStyle: 'Short modern cut', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Light',
        fullDescription: 'Lian is a young Asian woman in her mid-20s, standing 165cm (5\'5") tall and weighing approximately 108kg (238lbs). She has a full-bodied build maintaining youthful energy, very broad shoulders, very full arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips, and very heavy thighs. Her face is very full and round, warm gentle eyes, remarkably clear skin for her size, pronounced facial fullness, and peaceful serene features. She wears her black hair in a short modern cut. Her skin is light-toned. Lian embodies Asian beauty at every size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Indian': {
      'XS': [{
        id: 'IND_YA_F_XS_001', name: 'Priya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: 'XS',
        height: '157cm (5\'2")', weight: '47kg (104lbs)', build: 'Petite graceful frame',
        facialFeatures: 'Oval face with Indian features, large dark eyes, smooth brown skin, delicate structure',
        hairStyle: 'Long black straight', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium brown',
        fullDescription: 'Priya is a young Indian woman in her early 20s, standing 157cm (5\'2") tall and weighing approximately 47kg (104lbs). She has a petite, graceful frame with narrow shoulders, slim arms, flat stomach, small bust (A cup), narrow waist, slim hips with subtle curves, and slender toned legs. Her face is oval with classic Indian features, large expressive dark eyes, smooth brown skin, delicate refined bone structure. She wears her black hair long and straight. Her skin is a beautiful medium brown. Priya embodies petite Indian elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'IND_YA_F_S_001', name: 'Ananya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: 'S',
        height: '162cm (5\'4")', weight: '53kg (117lbs)', build: 'Slim feminine build',
        facialFeatures: 'Heart-shaped face, dark expressive eyes, golden-brown skin, elegant features',
        hairStyle: 'Long wavy black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Warm golden brown',
        fullDescription: 'Ananya is a young Indian woman in her mid-20s, standing 162cm (5\'4") tall and weighing approximately 53kg (117lbs). She has a slim, feminine build with graceful shoulders, toned slender arms, flat stomach with subtle definition, small to medium bust (B cup), defined waist, moderate hips with gentle curves, and shapely legs. Her face is heart-shaped, dark expressive eyes full of life, warm golden-brown skin, elegant refined features. She wears her black hair long and wavy. Her skin has a beautiful warm golden brown tone. Ananya represents modern Indian femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'IND_YA_F_M_001', name: 'Kavya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: 'M',
        height: '165cm (5\'5")', weight: '60kg (132lbs)', build: 'Balanced proportionate figure',
        facialFeatures: 'Oval face with warmth, dark eyes, smooth complexion, balanced features, natural grace',
        hairStyle: 'Long layered black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium to tan',
        fullDescription: 'Kavya is a young Indian woman in her late 20s, standing 165cm (5\'5") tall and weighing approximately 60kg (132lbs). She has a balanced, proportionate figure with moderate shoulders, toned arms, soft stomach with natural curves, medium bust (C cup), defined waist, curvy hips, and strong shapely legs. Her face is oval with natural warmth, beautiful dark eyes, smooth healthy complexion, balanced feminine features, and inherent grace. She wears her black hair long with layers. Her skin ranges from medium to tan. Kavya exemplifies balanced Indian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'IND_YA_F_L_001', name: 'Isha', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: 'L',
        height: '167cm (5\'6")', weight: '70kg (154lbs)', build: 'Curvy voluptuous build',
        facialFeatures: 'Round face with beauty, large eyes, radiant skin, full features, warm smile',
        hairStyle: 'Long thick wavy', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Deep brown',
        fullDescription: 'Isha is a young Indian woman in her mid-20s, standing 167cm (5\'6") tall and weighing approximately 70kg (154lbs). She has a curvy, voluptuous build with broader shoulders, fuller arms with tone, soft stomach with curves, full bust (D cup), thick waist, wide shapely hips, and thick powerful thighs. Her face is round with natural beauty, large captivating eyes, radiant glowing skin, full feminine features, and a warm inviting smile. She wears her dark brown hair long thick and wavy. Her skin is a deep rich brown. Isha represents voluptuous Indian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'IND_YA_F_XL_001', name: 'Neha', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: 'XL',
        height: '170cm (5\'7")', weight: '83kg (183lbs)', build: 'Full-figured with curves',
        facialFeatures: 'Round full face, expressive eyes, smooth skin, prominent features, confident presence',
        hairStyle: 'Medium length straight', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich brown',
        fullDescription: 'Neha is a young Indian woman in her early 20s, standing 170cm (5\'7") tall and weighing approximately 83kg (183lbs). She has a full-figured build with pronounced curves, wide shoulders, full arms with strength, rounded stomach with volume, large bust (DD cup), thick waist, wide full hips with dramatic curves, and substantial thick thighs. Her face is round and full, expressive beautiful eyes, smooth healthy skin, prominent striking features, and confident self-assured presence. She wears her black hair at medium length straight. Her skin is a rich brown. Neha embodies full-figured Indian confidence.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'IND_YA_F_2XL_001', name: 'Diya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: '2XL',
        height: '172cm (5\'8")', weight: '96kg (212lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, warm eyes, glowing complexion, soft features, radiant smile',
        hairStyle: 'Long wavy styled', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Medium brown',
        fullDescription: 'Diya is a young Indian woman in her late 20s, standing 172cm (5\'8") tall and weighing approximately 96kg (212lbs). She has a plus-size build with commanding presence, broad shoulders, full thick arms, prominent rounded stomach, very large bust (DDD/F cup), thick substantial waist, wide full hips with volume, and heavy thick thighs. Her face is full and round, warm gentle eyes, glowing radiant complexion, soft rounded features, and a naturally radiant smile. She wears her dark brown hair long and wavy with styling. Her skin is medium brown. Diya represents confident plus-size Indian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'IND_YA_F_3XL_001', name: 'Riya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indian', size: '3XL',
        height: '168cm (5\'6")', weight: '110kg (243lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, gentle eyes, smooth skin, pronounced fullness, peaceful expression',
        hairStyle: 'Medium length curly', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Deep tan',
        fullDescription: 'Riya is a young Indian woman in her mid-20s, standing 168cm (5\'6") tall and weighing approximately 110kg (243lbs). She has a full-bodied build retaining youthful warmth, very broad shoulders, very full thick arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips with substantial volume, and very heavy thighs. Her face is very full and round, gentle peaceful eyes, remarkably smooth skin, pronounced facial fullness, and a naturally peaceful expression. She wears her black hair at medium length with natural curls. Her skin is a deep tan. Riya embodies Indian beauty at any size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Southeast Asian': {
      'XS': [{
        id: 'SEA_YA_F_XS_001', name: 'Mai', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: 'XS',
        height: '153cm (5\'0")', weight: '45kg (99lbs)', build: 'Petite compact frame',
        facialFeatures: 'Small round face, dark eyes, smooth tan skin, delicate features, youthful beauty',
        hairStyle: 'Long straight black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Light tan',
        fullDescription: 'Mai is a young Southeast Asian woman in her early 20s, standing 153cm (5\'0") tall and weighing approximately 45kg (99lbs). She has a petite, compact frame with very narrow shoulders, very slim arms, flat stomach, small bust (A cup), narrow hips, and slender legs. Her face is small and round, beautiful dark eyes, smooth tan skin, delicate refined features, and youthful natural beauty. She wears her black hair long and straight. Her skin is a light tan. Mai embodies petite Southeast Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'SEA_YA_F_S_001', name: 'Anh', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: 'S',
        height: '158cm (5\'2")', weight: '51kg (112lbs)', build: 'Slim graceful build',
        facialFeatures: 'Oval face with Southeast Asian features, dark expressive eyes, smooth skin, elegant structure',
        hairStyle: 'Long layered black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium tan',
        fullDescription: 'Anh is a young Southeast Asian woman in her mid-20s, standing 158cm (5\'2") tall and weighing approximately 51kg (112lbs). She has a slim, graceful build with narrow shoulders, slender arms, flat stomach with subtle definition, small bust (A/B cup), defined waist, slim hips with gentle curves, and toned slender legs. Her face is oval with classic Southeast Asian features, dark expressive eyes full of life, smooth healthy skin, elegant bone structure. She wears her black hair long with layers. Her skin is a medium tan. Anh represents modern Southeast Asian elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'SEA_YA_F_M_001', name: 'Linh', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: 'M',
        height: '160cm (5\'3")', weight: '57kg (126lbs)', build: 'Balanced feminine figure',
        facialFeatures: 'Round face with warmth, dark eyes, smooth complexion, soft features, natural beauty',
        hairStyle: 'Medium length wavy', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Tan',
        fullDescription: 'Linh is a young Southeast Asian woman in her late 20s, standing 160cm (5\'3") tall and weighing approximately 57kg (126lbs). She has a balanced, feminine figure with moderate shoulders, toned arms, soft stomach with natural curves, medium bust (B/C cup), defined waist, moderate hips with curves, and shapely legs. Her face is round with natural warmth, expressive dark eyes, smooth clear complexion, soft feminine features, and Southeast Asian beauty. She wears her dark brown hair at medium length with waves. Her skin is tan. Linh exemplifies balanced Southeast Asian femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'SEA_YA_F_L_001', name: 'Siti', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: 'L',
        height: '163cm (5\'4")', weight: '67kg (148lbs)', build: 'Fuller curvy build',
        facialFeatures: 'Round full face, dark eyes, smooth skin, full cheeks, warm expression',
        hairStyle: 'Long thick straight', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Deep tan',
        fullDescription: 'Siti is a young Southeast Asian woman in her mid-20s, standing 163cm (5\'4") tall and weighing approximately 67kg (148lbs). She has a fuller, curvy build with broader shoulders, fuller arms, soft stomach with curves, full bust (C/D cup), thick waist, wider hips with pronounced curves, and thick shapely thighs. Her face is round and full, warm dark eyes, smooth healthy skin, full feminine cheeks, and a warm approachable expression. She wears her black hair long thick and straight. Her skin is a deep tan. Siti represents fuller Southeast Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'SEA_YA_F_XL_001', name: 'Dara', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: 'XL',
        height: '165cm (5\'5")', weight: '79kg (174lbs)', build: 'Full-figured with strength',
        facialFeatures: 'Round full face, expressive eyes, smooth complexion, full features, confident presence',
        hairStyle: 'Medium length straight', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Medium brown',
        fullDescription: 'Dara is a young Southeast Asian woman in her early 20s, standing 165cm (5\'5") tall and weighing approximately 79kg (174lbs). She has a full-figured build with underlying strength, wide shoulders, full arms, rounded stomach with volume, large bust (DD cup), thick waist, wide hips with fullness, and substantial thighs. Her face is round and full, expressive beautiful eyes, smooth clear complexion, full striking features, and confident presence. She wears her dark brown hair at medium length straight. Her skin is medium brown. Dara embodies confident full-figured Southeast Asian beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'SEA_YA_F_2XL_001', name: 'Putri', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: '2XL',
        height: '168cm (5\'6")', weight: '92kg (203lbs)', build: 'Plus-size with presence',
        facialFeatures: 'Full round face, gentle eyes, glowing skin, soft features, serene expression',
        hairStyle: 'Long wavy thick', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich tan',
        fullDescription: 'Putri is a young Southeast Asian woman in her late 20s, standing 168cm (5\'6") tall and weighing approximately 92kg (203lbs). She has a plus-size build with gentle presence, broad shoulders, full thick arms, prominent stomach, very large bust (DDD/F cup), thick waist, wide full hips, and heavy thighs. Her face is full and round, gentle kind eyes, glowing healthy skin, soft rounded features, and a serene peaceful expression. She wears her black hair long wavy and thick. Her skin is a rich tan. Putri represents plus-size Southeast Asian grace.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'SEA_YA_F_3XL_001', name: 'Malika', age: 'Young Adult', sex: 'Female', ethnicity: 'Southeast Asian', size: '3XL',
        height: '163cm (5\'4")', weight: '106kg (234lbs)', build: 'Full-bodied with youth',
        facialFeatures: 'Very full round face, warm eyes, smooth skin, pronounced fullness, peaceful features',
        hairStyle: 'Medium length curly', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Deep brown',
        fullDescription: 'Malika is a young Southeast Asian woman in her mid-20s, standing 163cm (5\'4") tall and weighing approximately 106kg (234lbs). She has a full-bodied build maintaining youthful warmth, very broad shoulders, very full arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips, and very heavy thighs. Her face is very full and round, warm gentle eyes, remarkably smooth skin, pronounced facial fullness, and peaceful serene features. She wears her dark brown hair at medium length with curls. Her skin is deep brown. Malika embodies Southeast Asian beauty at every size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Indigenous': {
      'XS': [{
        id: 'ING_YA_F_XS_001', name: 'Kaya', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: 'XS',
        height: '155cm (5\'1")', weight: '48kg (106lbs)', build: 'Petite strong frame',
        facialFeatures: 'Oval face with Indigenous features, dark eyes, warm brown skin, strong bone structure',
        hairStyle: 'Long straight black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Warm brown',
        fullDescription: 'Kaya is a young Indigenous woman in her early 20s, standing 155cm (5\'1") tall and weighing approximately 48kg (106lbs). She has a petite, strong frame with narrow shoulders, slim toned arms, flat stomach with natural strength, small bust (A cup), narrow hips, and strong slender legs. Her face is oval with Indigenous features, deep dark eyes full of wisdom, warm brown skin, strong defined bone structure. She wears her black hair long and straight. Her skin is a warm brown. Kaya embodies petite Indigenous strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'ING_YA_F_S_001', name: 'Aiyana', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: 'S',
        height: '160cm (5\'3")', weight: '54kg (119lbs)', build: 'Slim athletic build',
        facialFeatures: 'Strong face with Indigenous beauty, dark expressive eyes, bronze skin, prominent cheekbones',
        hairStyle: 'Long black with braids', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Bronze',
        fullDescription: 'Aiyana is a young Indigenous woman in her mid-20s, standing 160cm (5\'3") tall and weighing approximately 54kg (119lbs). She has a slim, athletic build with strong shoulders, toned arms with definition, flat stomach with athletic tone, small to medium bust (B cup), defined waist, moderate hips, and powerful athletic legs. Her face shows strong Indigenous beauty, dark expressive eyes, beautiful bronze skin, prominent striking cheekbones. She wears her black hair long with traditional braids. Her skin is bronze. Aiyana represents modern Indigenous athleticism.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'ING_YA_F_M_001', name: 'Nizhoni', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: 'M',
        height: '165cm (5\'5")', weight: '62kg (137lbs)', build: 'Balanced strong figure',
        facialFeatures: 'Round face with Indigenous features, dark eyes, warm complexion, strong features, natural beauty',
        hairStyle: 'Long flowing black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Deep bronze',
        fullDescription: 'Nizhoni is a young Indigenous woman in her late 20s, standing 165cm (5\'5") tall and weighing approximately 62kg (137lbs). She has a balanced, strong figure with proportioned shoulders, toned arms with strength, firm stomach with natural curves, medium bust (C cup), defined waist, curvy hips, and strong powerful legs. Her face is round with Indigenous features, warm dark eyes, rich warm complexion, strong defined features, and natural Indigenous beauty. She wears her black hair long and flowing. Her skin is deep bronze. Nizhoni exemplifies Indigenous feminine strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'ING_YA_F_L_001', name: 'Chenoa', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: 'L',
        height: '168cm (5\'6")', weight: '71kg (156lbs)', build: 'Powerful curvy build',
        facialFeatures: 'Full face with strength, dark eyes, bronze skin, prominent features, confident expression',
        hairStyle: 'Long thick straight', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Rich brown',
        fullDescription: 'Chenoa is a young Indigenous woman in her mid-20s, standing 168cm (5\'6") tall and weighing approximately 71kg (156lbs). She has a powerful, curvy build with broad strong shoulders, fuller arms with muscle tone, soft stomach with power, full bust (D cup), thick waist, wide shapely hips, and thick powerful thighs. Her face is full with inherent strength, intense dark eyes, beautiful bronze skin, prominent striking features, and a confident powerful expression. She wears her dark brown hair long thick and straight. Her skin is rich brown. Chenoa represents powerful Indigenous beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'ING_YA_F_XL_001', name: 'Takoda', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: 'XL',
        height: '170cm (5\'7")', weight: '84kg (185lbs)', build: 'Full-figured with power',
        facialFeatures: 'Round full face, strong eyes, warm skin, full features, commanding presence',
        hairStyle: 'Long layered black', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Deep brown',
        fullDescription: 'Takoda is a young Indigenous woman in her early 20s, standing 170cm (5\'7") tall and weighing approximately 84kg (185lbs). She has a full-figured build with physical power, wide shoulders with strength, full arms with muscle, rounded stomach with volume, large bust (DD cup), thick waist, wide full hips, and substantial powerful thighs. Her face is round and full, strong penetrating eyes, warm healthy skin, full striking features, and commanding powerful presence. She wears her black hair long with layers. Her skin is deep brown. Takoda embodies powerful full-figured Indigenous strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'ING_YA_F_2XL_001', name: 'Aponi', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: '2XL',
        height: '173cm (5\'8")', weight: '97kg (214lbs)', build: 'Plus-size with strength',
        facialFeatures: 'Full round face, wise eyes, rich complexion, soft features, maternal presence',
        hairStyle: 'Long straight traditional', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Medium brown',
        fullDescription: 'Aponi is a young Indigenous woman in her late 20s, standing 173cm (5\'8") tall and weighing approximately 97kg (214lbs). She has a plus-size build with underlying strength, broad powerful shoulders, full thick arms, prominent stomach, very large bust (DDD/F cup), thick waist, wide full hips, and heavy strong thighs. Her face is full and round, wise knowing eyes, rich warm complexion, soft rounded features, and a maternal nurturing presence. She wears her black hair long straight in traditional style. Her skin is medium brown. Aponi represents plus-size Indigenous wisdom.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'ING_YA_F_3XL_001', name: 'Winona', age: 'Young Adult', sex: 'Female', ethnicity: 'Indigenous', size: '3XL',
        height: '168cm (5\'6")', weight: '111kg (245lbs)', build: 'Full-bodied with heritage',
        facialFeatures: 'Very full round face, deep eyes, warm skin, pronounced fullness, strong features',
        hairStyle: 'Medium length traditional', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich bronze',
        fullDescription: 'Winona is a young Indigenous woman in her mid-20s, standing 168cm (5\'6") tall and weighing approximately 111kg (245lbs). She has a full-bodied build honoring her heritage, very broad shoulders, very full arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips, and very heavy powerful thighs. Her face is very full and round, deep wise eyes, warm rich skin, pronounced facial fullness, and strong Indigenous features. She wears her black hair at medium length in traditional style. Her skin is rich bronze. Winona embodies Indigenous beauty and strength at any size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Diverse': {
      'XS': [{
        id: 'DIV_YA_F_XS_001', name: 'Alex', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: 'XS',
        height: '157cm (5\'2")', weight: '49kg (108lbs)', build: 'Petite athletic frame',
        facialFeatures: 'Unique mixed features, hazel eyes, medium-toned skin, distinctive beauty, multicultural appearance',
        hairStyle: 'Long wavy natural', hairColor: 'Dark brown with natural highlights', eyeColor: 'Hazel', skinTone: 'Medium olive',
        fullDescription: 'Alex is a young woman of diverse heritage in her early 20s, standing 157cm (5\'2") tall and weighing approximately 49kg (108lbs). She has a petite, athletic frame with narrow shoulders, slim toned arms, flat stomach with definition, small bust (A cup), narrow waist, slim hips with subtle curves, and toned legs. Her face shows unique mixed features, striking hazel eyes, medium-toned skin with warmth, distinctive multicultural beauty. She wears her dark brown hair with natural highlights long and wavy. Her skin is medium olive. Alex embodies petite multicultural beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'DIV_YA_F_S_001', name: 'Jordan', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: 'S',
        height: '163cm (5\'4")', weight: '55kg (121lbs)', build: 'Slim versatile build',
        facialFeatures: 'Blended features, green-brown eyes, warm complexion, unique beauty, diverse heritage visible',
        hairStyle: 'Medium length loose curls', hairColor: 'Brown', eyeColor: 'Green-brown', skinTone: 'Warm tan',
        fullDescription: 'Jordan is a young woman of diverse heritage in her mid-20s, standing 163cm (5\'4") tall and weighing approximately 55kg (121lbs). She has a slim, versatile build with graceful shoulders, toned arms, flat stomach with gentle definition, small to medium bust (B cup), defined waist, moderate hips with curves, and shapely legs. Her face shows beautifully blended features, captivating green-brown eyes, warm glowing complexion, unique multicultural beauty, diverse heritage clearly visible. She wears her brown hair at medium length with loose curls. Her skin is warm tan. Jordan represents modern diverse elegance.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'DIV_YA_F_M_001', name: 'Casey', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: 'M',
        height: '168cm (5\'6")', weight: '62kg (137lbs)', build: 'Balanced multicultural figure',
        facialFeatures: 'Mixed heritage face, dark eyes, medium complexion, harmonious features, global beauty',
        hairStyle: 'Long layered wavy', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Medium',
        fullDescription: 'Casey is a young woman of diverse heritage in her late 20s, standing 168cm (5\'6") tall and weighing approximately 62kg (137lbs). She has a balanced, multicultural figure with proportioned shoulders, toned arms, soft stomach with natural curves, medium bust (C cup), defined waist, curvy hips, and strong shapely legs. Her face reflects mixed heritage, warm dark eyes, beautiful medium complexion, harmonious blended features, and global multicultural beauty. She wears her dark brown hair long with layers and waves. Her skin is medium-toned. Casey exemplifies balanced diverse femininity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'DIV_YA_F_L_001', name: 'Morgan', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: 'L',
        height: '170cm (5\'7")', weight: '71kg (156lbs)', build: 'Curvy diverse build',
        facialFeatures: 'Full face with mixed features, brown eyes, rich complexion, multicultural beauty, warm expression',
        hairStyle: 'Long textured curly', hairColor: 'Brown with caramel', eyeColor: 'Brown', skinTone: 'Rich tan',
        fullDescription: 'Morgan is a young woman of diverse heritage in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 71kg (156lbs). She has a curvy, diverse build with broader shoulders, fuller arms with tone, soft stomach with curves, full bust (D cup), thick waist, wide shapely hips, and thick powerful thighs. Her face is full with mixed heritage features, warm brown eyes, rich beautiful complexion, striking multicultural beauty, and a warm inviting expression. She wears her brown hair with caramel highlights long textured and curly. Her skin is rich tan. Morgan represents curvy diverse beauty.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'DIV_YA_F_XL_001', name: 'Riley', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: 'XL',
        height: '173cm (5\'8")', weight: '85kg (187lbs)', build: 'Full-figured with diversity',
        facialFeatures: 'Round full face, expressive eyes, warm skin, prominent features, multicultural confidence',
        hairStyle: 'Medium length curly styled', hairColor: 'Dark with highlights', eyeColor: 'Dark brown', skinTone: 'Deep tan',
        fullDescription: 'Riley is a young woman of diverse heritage in her early 20s, standing 173cm (5\'8") tall and weighing approximately 85kg (187lbs). She has a full-figured build celebrating diversity, wide shoulders, full arms with strength, rounded stomach with volume, large bust (DD cup), thick waist, wide full hips, and substantial strong thighs. Her face is round and full, expressive beautiful eyes, warm healthy skin, prominent multicultural features, and confident self-assured presence. She wears her dark hair with highlights at medium length curly and styled. Her skin is deep tan. Riley embodies full-figured diverse confidence.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'DIV_YA_F_2XL_001', name: 'Avery', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: '2XL',
        height: '175cm (5\'9")', weight: '98kg (216lbs)', build: 'Plus-size with heritage',
        facialFeatures: 'Full round face, kind eyes, glowing complexion, soft features, diverse beauty',
        hairStyle: 'Long flowing wavy', hairColor: 'Brown', eyeColor: 'Brown', skinTone: 'Medium brown',
        fullDescription: 'Avery is a young woman of diverse heritage in her late 20s, standing 175cm (5\'9") tall and weighing approximately 98kg (216lbs). She has a plus-size build honoring her heritage, broad shoulders, full thick arms, prominent stomach, very large bust (DDD/F cup), thick waist, wide full hips, and heavy thighs. Her face is full and round, kind gentle eyes, glowing radiant complexion, soft rounded features, and beautiful diverse multicultural beauty. She wears her brown hair long flowing and wavy. Her skin is medium brown. Avery represents plus-size diverse grace.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'DIV_YA_F_3XL_001', name: 'Sage', age: 'Young Adult', sex: 'Female', ethnicity: 'Diverse', size: '3XL',
        height: '170cm (5\'7")', weight: '112kg (247lbs)', build: 'Full-bodied with heritage',
        facialFeatures: 'Very full round face, warm eyes, rich skin, pronounced fullness, multicultural features',
        hairStyle: 'Medium textured natural', hairColor: 'Dark brown', eyeColor: 'Dark brown', skinTone: 'Deep brown',
        fullDescription: 'Sage is a young woman of diverse heritage in her mid-20s, standing 170cm (5\'7") tall and weighing approximately 112kg (247lbs). She has a full-bodied build celebrating her heritage, very broad shoulders, very full arms, large prominent stomach, extra-large bust (G+ cup), very thick waist, very wide hips, and very heavy thighs. Her face is very full and round, warm welcoming eyes, rich beautiful skin, pronounced facial fullness, and striking multicultural features. She wears her dark brown hair at medium length textured and natural. Her skin is deep brown. Sage embodies diverse beauty at every size.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    }
  },
  'Male': {
    'White': {
      'XS': [{
        id: 'WHT_YA_M_XS_001', name: 'Ethan', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: 'XS',
        height: '168cm (5\'6")', weight: '58kg (128lbs)', build: 'Slim lean frame',
        facialFeatures: 'Youthful face with defined jaw, blue eyes, clear skin, sharp features, light stubble',
        hairStyle: 'Short textured', hairColor: 'Light brown', eyeColor: 'Blue', skinTone: 'Fair',
        fullDescription: 'Ethan is a young White man in his early 20s, standing 168cm (5\'6") tall and weighing approximately 58kg (128lbs). He has a slim, lean frame with narrow shoulders, thin arms with slight definition, flat stomach with visible ribs, narrow chest, slim waist, narrow hips, and thin legs with minimal muscle. His face is youthful with a defined jaw, bright blue eyes, clear smooth skin, sharp angular features, and light stubble. He wears his light brown hair short and textured. His skin is fair. Ethan embodies lean young masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'WHT_YA_M_S_001', name: 'Noah', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: 'S',
        height: '173cm (5\'8")', weight: '65kg (143lbs)', build: 'Lean athletic build',
        facialFeatures: 'Angular face, green eyes, clean skin, structured features, neat facial hair',
        hairStyle: 'Short styled', hairColor: 'Dark blonde', eyeColor: 'Green', skinTone: 'Light',
        fullDescription: 'Noah is a young White man in his mid-20s, standing 173cm (5\'8") tall and weighing approximately 65kg (143lbs). He has a lean, athletic build with moderate shoulders, toned arms with definition, flat stomach with slight ab definition, defined chest, trim waist, narrow hips, and toned legs with lean muscle. His face is angular, striking green eyes, clean clear skin, well-structured features, and neat maintained facial hair. He wears his dark blonde hair short and styled. His skin is light. Noah represents lean athletic masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'WHT_YA_M_M_001', name: 'Liam', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: 'M',
        height: '178cm (5\'10")', weight: '75kg (165lbs)', build: 'Athletic balanced physique',
        facialFeatures: 'Strong jaw, hazel eyes, healthy complexion, masculine features, short beard',
        hairStyle: 'Short sides longer top', hairColor: 'Brown', eyeColor: 'Hazel', skinTone: 'Medium fair',
        fullDescription: 'Liam is a young White man in his late 20s, standing 178cm (5\'10") tall and weighing approximately 75kg (165lbs). He has an athletic, balanced physique with broad shoulders, muscular arms with good definition, flat stomach with visible abs, defined chest, trim waist, narrow hips, and strong muscular legs. His face shows a strong jaw, expressive hazel eyes, healthy clear complexion, masculine defined features, and a short well-groomed beard. He wears his brown hair short on sides with length on top. His skin is medium fair. Liam exemplifies balanced young masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'WHT_YA_M_L_001', name: 'Mason', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: 'L',
        height: '183cm (6\'0")', weight: '88kg (194lbs)', build: 'Strong muscular build',
        facialFeatures: 'Broad face with strong jaw, blue-gray eyes, rugged skin, masculine features, full beard',
        hairStyle: 'Short cropped', hairColor: 'Dark brown', eyeColor: 'Blue-gray', skinTone: 'Fair to medium',
        fullDescription: 'Mason is a young White man in his mid-20s, standing 183cm (6\'0") tall and weighing approximately 88kg (194lbs). He has a strong, muscular build with very broad shoulders, thick muscular arms, solid core with visible abs, broad muscular chest, thick waist, narrow hips, and thick powerful legs. His face is broad with a strong prominent jaw, intense blue-gray eyes, rugged healthy skin, highly masculine features, and a full maintained beard. He wears his dark brown hair short and cropped. His skin ranges from fair to medium. Mason represents strong young masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'WHT_YA_M_XL_001', name: 'Lucas', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: 'XL',
        height: '185cm (6\'1")', weight: '102kg (225lbs)', build: 'Large powerful build',
        facialFeatures: 'Broad strong face, brown eyes, healthy skin, prominent features, trimmed beard',
        hairStyle: 'Very short buzz cut', hairColor: 'Light brown', eyeColor: 'Brown', skinTone: 'Light',
        fullDescription: 'Lucas is a young White man in his early 20s, standing 185cm (6\'1") tall and weighing approximately 102kg (225lbs). He has a large, powerful build with extra broad shoulders, very thick muscular arms, solid stomach with some softness, very broad chest, thick waist, moderate hips, and very thick strong legs. His face is broad and strong, warm brown eyes, healthy clear skin, prominent masculine features, and a trimmed well-kept beard. He wears his light brown hair in a very short buzz cut. His skin is light. Lucas embodies large powerful youth.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'WHT_YA_M_2XL_001', name: 'James', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: '2XL',
        height: '188cm (6\'2")', weight: '118kg (260lbs)', build: 'Heavyweight strong build',
        facialFeatures: 'Full broad face, blue eyes, ruddy complexion, substantial features, full beard',
        hairStyle: 'Short receding', hairColor: 'Blonde', eyeColor: 'Blue', skinTone: 'Fair',
        fullDescription: 'James is a young White man in his late 20s, standing 188cm (6\'2") tall and weighing approximately 118kg (260lbs). He has a heavyweight, strong build with very broad thick shoulders, very thick powerful arms, rounded stomach with underlying muscle, very broad thick chest, thick substantial waist, wider hips, and extremely thick powerful legs. His face is full and broad, bright blue eyes, ruddy healthy complexion, substantial masculine features, and a full impressive beard. He wears his blonde hair short with slight receding. His skin is fair. James represents heavyweight masculine strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'WHT_YA_M_3XL_001', name: 'Benjamin', age: 'Young Adult', sex: 'Male', ethnicity: 'White', size: '3XL',
        height: '183cm (6\'0")', weight: '135kg (298lbs)', build: 'Heavy powerful frame',
        facialFeatures: 'Very broad full face, green eyes, full complexion, prominent jaw, thick beard',
        hairStyle: 'Short thinning', hairColor: 'Brown', eyeColor: 'Green', skinTone: 'Medium fair',
        fullDescription: 'Benjamin is a young White man in his mid-20s, standing 183cm (6\'0") tall and weighing approximately 135kg (298lbs). He has a heavy, powerful frame with extremely broad shoulders, extremely thick arms with strength, large prominent stomach, extremely broad chest, very thick waist, wide substantial hips, and extremely heavy powerful legs. His face is very broad and full, striking green eyes, full ruddy complexion, prominent strong jaw despite fullness, and a thick full beard. He wears his brown hair short with some thinning. His skin is medium fair. Benjamin embodies powerful heavyweight masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Black': {
      'XS': [{
        id: 'BLK_YA_M_XS_001', name: 'Jamal', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: 'XS',
        height: '170cm (5\'7")', weight: '60kg (132lbs)', build: 'Slim wiry frame',
        facialFeatures: 'Angular face with defined features, dark eyes, smooth dark skin, sharp jaw, light facial hair',
        hairStyle: 'Short fade', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Dark brown',
        fullDescription: 'Jamal is a young Black man in his early 20s, standing 170cm (5\'7") tall and weighing approximately 60kg (132lbs). He has a slim, wiry frame with narrow shoulders, thin toned arms, flat stomach with definition, narrow chest, slim waist, narrow hips, and lean athletic legs. His face is angular with defined features, intense dark eyes, smooth rich melanin skin, sharp defined jaw, and light maintained facial hair. He wears his black hair in a short fade. His skin is dark brown. Jamal embodies lean Black athletic build.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'BLK_YA_M_S_001', name: 'Marcus', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: 'S',
        height: '175cm (5\'9")', weight: '68kg (150lbs)', build: 'Lean athletic build',
        facialFeatures: 'Oval face, dark expressive eyes, rich melanin skin, chiseled features, neat beard',
        hairStyle: 'Low fade waves', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium brown',
        fullDescription: 'Marcus is a young Black man in his mid-20s, standing 175cm (5\'9") tall and weighing approximately 68kg (150lbs). He has a lean, athletic build with moderate shoulders, well-defined arms, flat stomach with visible abs, defined chest, trim waist, narrow hips, and athletic toned legs. His face is oval, dark expressive eyes full of confidence, rich glowing melanin skin, chiseled masculine features, and a neat well-groomed beard. He wears his black hair in low fade with waves. His skin is medium brown. Marcus represents lean Black athleticism.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'BLK_YA_M_M_001', name: 'Darius', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: 'M',
        height: '180cm (5\'11")', weight: '78kg (172lbs)', build: 'Athletic muscular physique',
        facialFeatures: 'Strong face with prominent jaw, brown eyes, flawless dark skin, masculine features, short beard',
        hairStyle: 'High fade', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Deep brown',
        fullDescription: 'Darius is a young Black man in his late 20s, standing 180cm (5\'11") tall and weighing approximately 78kg (172lbs). He has an athletic, muscular physique with broad shoulders, well-developed arms with definition, flat stomach with six-pack abs, sculpted chest, trim waist, narrow hips, and powerful athletic legs. His face is strong with prominent jaw, warm brown eyes, flawless dark melanin skin, highly masculine features, and a short shaped beard. He wears his black hair in a high fade. His skin is deep brown. Darius exemplifies athletic Black masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'BLK_YA_M_L_001', name: 'Terrell', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: 'L',
        height: '185cm (6\'1")', weight: '92kg (203lbs)', build: 'Strong powerful build',
        facialFeatures: 'Broad face with strong features, dark eyes, rich skin, commanding jaw, full beard',
        hairStyle: 'Short natural', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Dark chocolate',
        fullDescription: 'Terrell is a young Black man in his mid-20s, standing 185cm (6\'1") tall and weighing approximately 92kg (203lbs). He has a strong, powerful build with very broad shoulders, thick muscular arms, solid core with definition, broad powerful chest, thick waist, narrow hips, and extremely thick muscular legs. His face is broad with strong commanding features, intense dark eyes, rich healthy melanin skin, powerful commanding jaw, and a full well-maintained beard. He wears his black hair short and natural. His skin is dark chocolate. Terrell represents powerful Black strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'BLK_YA_M_XL_001', name: 'Isaiah', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: 'XL',
        height: '188cm (6\'2")', weight: '106kg (234lbs)', build: 'Large imposing build',
        facialFeatures: 'Broad strong face, dark eyes, smooth dark skin, prominent features, thick beard',
        hairStyle: 'Bald shaved', hairColor: 'Bald', eyeColor: 'Dark brown', skinTone: 'Rich ebony',
        fullDescription: 'Isaiah is a young Black man in his early 20s, standing 188cm (6\'2") tall and weighing approximately 106kg (234lbs). He has a large, imposing build with extremely broad shoulders, very thick powerful arms, solid stomach with underlying strength, extremely broad chest, thick substantial waist, moderate hips, and very thick powerful legs. His face is broad and strong, piercing dark eyes, smooth rich melanin skin, prominent commanding features, and a thick impressive beard. He has a bald shaved head. His skin is rich ebony. Isaiah embodies large imposing Black masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'BLK_YA_M_2XL_001', name: 'DeShawn', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: '2XL',
        height: '190cm (6\'3")', weight: '122kg (269lbs)', build: 'Heavyweight powerful frame',
        facialFeatures: 'Full broad face, brown eyes, dark complexion, strong jaw, full beard',
        hairStyle: 'Very short fade', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Deep brown',
        fullDescription: 'DeShawn is a young Black man in his late 20s, standing 190cm (6\'3") tall and weighing approximately 122kg (269lbs). He has a heavyweight, powerful frame with massively broad shoulders, extremely thick muscular arms, rounded stomach with strength, massively broad chest, very thick waist, wider hips, and extremely thick powerful legs. His face is full and broad, warm brown eyes, rich dark complexion, strong visible jaw, and a full commanding beard. He wears his black hair in a very short fade. His skin is deep brown. DeShawn represents heavyweight Black power.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'BLK_YA_M_3XL_001', name: 'Malik', age: 'Young Adult', sex: 'Male', ethnicity: 'Black', size: '3XL',
        height: '185cm (6\'1")', weight: '140kg (309lbs)', build: 'Heavy dominant frame',
        facialFeatures: 'Very broad full face, dark eyes, rich skin, strong features, thick beard',
        hairStyle: 'Bald', hairColor: 'Bald', eyeColor: 'Dark brown', skinTone: 'Deep ebony',
        fullDescription: 'Malik is a young Black man in his mid-20s, standing 185cm (6\'1") tall and weighing approximately 140kg (309lbs). He has a heavy, dominant frame with extraordinarily broad shoulders, extraordinarily thick arms with power, large prominent stomach, extraordinarily broad chest, extremely thick waist, wide substantial hips, and extremely heavy powerful legs. His face is very broad and full, intense dark eyes, rich glowing melanin skin, strong masculine features, and a thick impressive beard. He is bald. His skin is deep ebony. Malik embodies heavyweight dominant Black masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Hispanic': {
      'XS': [{
        id: 'HIS_YA_M_XS_001', name: 'Diego', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: 'XS',
        height: '168cm (5\'6")', weight: '59kg (130lbs)', build: 'Slim compact frame',
        facialFeatures: 'Angular face with Latin features, dark eyes, olive skin, defined jaw, light stubble',
        hairStyle: 'Short styled up', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Medium olive',
        fullDescription: 'Diego is a young Hispanic man in his early 20s, standing 168cm (5\'6") tall and weighing approximately 59kg (130lbs). He has a slim, compact frame with narrow shoulders, thin arms with slight tone, flat stomach with definition, narrow chest, slim waist, narrow hips, and lean legs. His face is angular with Latin features, expressive dark eyes, smooth olive skin, defined sharp jaw, and light stylish stubble. He wears his black hair short and styled up. His skin is medium olive. Diego embodies slim Latino style.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'S': [{
        id: 'HIS_YA_M_S_001', name: 'Carlos', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: 'S',
        height: '173cm (5\'8")', weight: '67kg (148lbs)', build: 'Lean athletic build',
        facialFeatures: 'Oval face, brown eyes, tan complexion, strong features, neat facial hair',
        hairStyle: 'Short with fade', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Tan',
        fullDescription: 'Carlos is a young Hispanic man in his mid-20s, standing 173cm (5\'8") tall and weighing approximately 67kg (148lbs). He has a lean, athletic build with moderate shoulders, toned defined arms, flat stomach with abs, defined chest, trim waist, narrow hips, and athletic legs. His face is oval, warm brown eyes, healthy tan complexion, strong masculine features, and neat maintained facial hair. He wears his dark brown hair short with a fade. His skin is tan. Carlos represents lean Latino athleticism.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'M': [{
        id: 'HIS_YA_M_M_001', name: 'Miguel', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: 'M',
        height: '178cm (5\'10")', weight: '76kg (168lbs)', build: 'Athletic balanced physique',
        facialFeatures: 'Strong face with defined jaw, dark eyes, golden brown skin, masculine features, short beard',
        hairStyle: 'Medium length pushed back', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Golden brown',
        fullDescription: 'Miguel is a young Hispanic man in his late 20s, standing 178cm (5\'10") tall and weighing approximately 76kg (168lbs). He has an athletic, balanced physique with broad shoulders, well-developed arms, flat stomach with visible abs, defined chest, trim waist, narrow hips, and strong muscular legs. His face is strong with defined jaw, intense dark eyes, golden brown skin, highly masculine features, and a short shaped beard. He wears his black hair at medium length pushed back. His skin is golden brown. Miguel exemplifies balanced Latino masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'L': [{
        id: 'HIS_YA_M_L_001', name: 'Alejandro', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: 'L',
        height: '183cm (6\'0")', weight: '90kg (198lbs)', build: 'Strong muscular build',
        facialFeatures: 'Broad face with strong jaw, brown eyes, bronze skin, commanding features, full beard',
        hairStyle: 'Short faded sides', hairColor: 'Black', eyeColor: 'Brown', skinTone: 'Bronze',
        fullDescription: 'Alejandro is a young Hispanic man in his mid-20s, standing 183cm (6\'0") tall and weighing approximately 90kg (198lbs). He has a strong, muscular build with very broad shoulders, thick muscular arms, solid core with definition, broad powerful chest, thick waist, narrow hips, and very thick powerful legs. His face is broad with strong prominent jaw, warm brown eyes, rich bronze skin, commanding masculine features, and a full impressive beard. He wears his black hair short with faded sides. His skin is bronze. Alejandro represents powerful Latino strength.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XL': [{
        id: 'HIS_YA_M_XL_001', name: 'Luis', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: 'XL',
        height: '185cm (6\'1")', weight: '104kg (229lbs)', build: 'Large powerful frame',
        facialFeatures: 'Broad strong face, dark eyes, rich tan skin, prominent features, thick beard',
        hairStyle: 'Very short buzzed', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich tan',
        fullDescription: 'Luis is a young Hispanic man in his early 20s, standing 185cm (6\'1") tall and weighing approximately 104kg (229lbs). He has a large, powerful frame with extremely broad shoulders, very thick muscular arms, solid stomach with some softness, extremely broad chest, thick substantial waist, moderate hips, and very thick powerful legs. His face is broad and strong, intense dark eyes, rich tan skin, prominent commanding features, and a thick well-kept beard. He wears his black hair very short and buzzed. His skin is rich tan. Luis embodies large powerful Latino presence.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXL': [{
        id: 'HIS_YA_M_2XL_001', name: 'Fernando', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: '2XL',
        height: '188cm (6\'2")', weight: '120kg (265lbs)', build: 'Heavyweight strong build',
        facialFeatures: 'Full broad face, brown eyes, deep tan complexion, strong jaw, full beard',
        hairStyle: 'Short traditional', hairColor: 'Dark brown', eyeColor: 'Brown', skinTone: 'Deep tan',
        fullDescription: 'Fernando is a young Hispanic man in his late 20s, standing 188cm (6\'2") tall and weighing approximately 120kg (265lbs). He has a heavyweight, strong build with massively broad shoulders, extremely thick powerful arms, rounded stomach with underlying muscle, massively broad chest, very thick waist, wider hips, and extremely thick legs. His face is full and broad, warm brown eyes, deep tan complexion, strong visible jaw, and a full commanding beard. He wears his dark brown hair short in a traditional cut. His skin is deep tan. Fernando represents heavyweight Latino power.',
        version: '1.0', createdDate: '2024-12-04'
      }],
      'XXXL': [{
        id: 'HIS_YA_M_3XL_001', name: 'Roberto', age: 'Young Adult', sex: 'Male', ethnicity: 'Hispanic', size: '3XL',
        height: '183cm (6\'0")', weight: '138kg (304lbs)', build: 'Heavy commanding frame',
        facialFeatures: 'Very broad full face, dark eyes, rich brown skin, strong features, thick beard',
        hairStyle: 'Short receding', hairColor: 'Black', eyeColor: 'Dark brown', skinTone: 'Rich brown',
        fullDescription: 'Roberto is a young Hispanic man in his mid-20s, standing 183cm (6\'0") tall and weighing approximately 138kg (304lbs). He has a heavy, commanding frame with extraordinarily broad shoulders, extraordinarily thick arms, large prominent stomach, extraordinarily broad chest, extremely thick waist, wide substantial hips, and extremely heavy powerful legs. His face is very broad and full, intense dark eyes, rich brown skin, strong masculine features, and a thick impressive beard. He wears his black hair short with slight receding. His skin is rich brown. Roberto embodies heavyweight dominant Latino masculinity.',
        version: '1.0', createdDate: '2024-12-04'
      }]
    },
    'Asian': {
        // Data for Asian Male Young Adults
    },
    'Indian': {
        // Data for Indian Male Young Adults
    },
    'Southeast Asian': {
        // Data for Southeast Asian Male Young Adults
    },
    'Indigenous': {
       // Data for Indigenous Male Young Adults
    },
    'Diverse': {
       // Data for Diverse Male Young Adults
    }
  }
};