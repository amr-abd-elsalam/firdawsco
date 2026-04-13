/* ── Firdaws Import & Export Co. — Company Data Layer ──
   Single source of truth for all company content.
   Hierarchy: categories[] → products[] (linked by categoryId)
   Also: certifications[], faq[], META{} with all bilingual UI strings.
   BRAND_NAME is { en, ar } — NOT a string.
   ── End Summary ── */

'use strict';

var COMPANY_DATA = (function () {

  function deepFreeze(o) {
    if (o === null || typeof o !== 'object') return o;
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach(function (p) {
      var v = o[p];
      if (v !== null && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v);
    });
    return o;
  }

  /* ── Categories (6) ── */

  var categories = [
    {
      id: 'citrus',
      icon: 'bi-circle-half',
      color: 'orange',
      en: { name: 'Citrus Fruits', desc: 'Premium Egyptian citrus — navel oranges, Valencia oranges, mandarins, and lemons — grown in the fertile Nile Delta and exported worldwide.' },
      ar: { name: 'حمضيات', desc: 'حمضيات مصرية ممتازة — برتقال أبو سرة وفالنسيا ويوسفي وليمون — من أراضي دلتا النيل الخصبة للتصدير العالمي.' }
    },
    {
      id: 'fresh-fruits',
      icon: 'bi-tree',
      color: 'emerald',
      en: { name: 'Fresh Fruits', desc: 'Hand-picked fresh fruits including table grapes, strawberries, pomegranates, mangoes, guavas, and watermelons — naturally sweet, export-grade quality.' },
      ar: { name: 'فاكهة طازجة', desc: 'فواكه طازجة مختارة يدوياً تشمل عنب وفراولة ورمان ومانجو وجوافة وبطيخ — حلاوة طبيعية وجودة تصديرية.' }
    },
    {
      id: 'fresh-vegetables',
      icon: 'bi-flower1',
      color: 'teal',
      en: { name: 'Fresh Vegetables', desc: 'Field-fresh vegetables — potatoes, onions, garlic, sweet potatoes, green beans, bell peppers, and tomatoes — sourced from Egypt\'s prime growing regions.' },
      ar: { name: 'خضروات طازجة', desc: 'خضروات طازجة من الحقل — بطاطس وبصل وثوم وبطاطا حلوة وفاصوليا خضراء وفلفل رومي وطماطم — من أجود مناطق الزراعة في مصر.' }
    },
    {
      id: 'frozen',
      icon: 'bi-snow',
      color: 'cyan',
      en: { name: 'Frozen Products', desc: 'IQF (Individually Quick Frozen) fruits and vegetables — strawberries, green beans, and green peas — available year-round with full traceability.' },
      ar: { name: 'منتجات مجمدة', desc: 'فواكه وخضروات مجمدة بتقنية IQF (التجميد السريع الفردي) — فراولة وفاصوليا خضراء وبسلة — متاحة طوال العام مع تتبع كامل.' }
    },
    {
      id: 'herbs-spices',
      icon: 'bi-leaf',
      color: 'lime',
      en: { name: 'Herbs & Spices', desc: 'Aromatic Egyptian herbs and spices — fresh basil and dried chamomile — cultivated under optimal conditions for maximum flavor and purity.' },
      ar: { name: 'أعشاب وتوابل', desc: 'أعشاب وتوابل مصرية عطرية — ريحان طازج وبابونج مجفف — مزروعة في ظروف مثالية لأقصى نكهة ونقاء.' }
    },
    {
      id: 'dry-goods',
      icon: 'bi-basket',
      color: 'amber',
      en: { name: 'Dry Goods & Grains', desc: 'Premium dried legumes and grains — white beans and other pulses — carefully sorted, cleaned, and packed for bulk export.' },
      ar: { name: 'حبوب وبقوليات', desc: 'بقوليات وحبوب مجففة ممتازة — فاصوليا بيضاء وبقوليات أخرى — مفرزة ومنظفة ومعبأة بعناية للتصدير بالجملة.' }
    }
  ];

  /* ── Products (24) ── */

  var products = [
    /* ── Citrus (4) ── */
    {
      id: 'navel-orange',
      categoryId: 'citrus',
      image: './assets/img/products/navel-orange.webp',
      hsCode: '080510',
      season: { from: 11, to: 4 },
      available: true,
      packagingOptions: ['8 kg open-top carton', '15 kg carton', 'Mesh bags 10 kg', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '4–6 weeks (cold storage at 3–5°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Navel Orange',
        description: 'Egyptian Navel Oranges are among the world\'s finest, renowned for their seedless flesh, vibrant color, and naturally high sweetness. Grown in the Nile Delta and Upper Egypt, our navel oranges are carefully hand-picked at peak ripeness and packed under strict quality control for global markets.',
        varieties: ['Washington Navel', 'Cara Cara', 'Lane Late'],
        specs: {
          caliber: '48–88 mm (sizes 48, 56, 64, 72, 80, 88)',
          brix: '11–14° Brix',
          color: 'Deep orange, uniform'
        }
      },
      ar: {
        name: 'برتقال أبو سرة',
        description: 'البرتقال المصري أبو سرة من أجود الأنواع عالمياً، يتميز بلبه الخالي من البذور ولونه الزاهي وحلاوته الطبيعية العالية. يُزرع في دلتا النيل وصعيد مصر، ويُقطف يدوياً في ذروة النضج ويُعبأ تحت رقابة جودة صارمة للأسواق العالمية.',
        varieties: ['واشنطن نافل', 'كارا كارا', 'لين ليت'],
        specs: {
          caliber: '٤٨–٨٨ مم (مقاسات ٤٨، ٥٦، ٦٤، ٧٢، ٨٠، ٨٨)',
          brix: '١١–١٤° بريكس',
          color: 'برتقالي غامق، موحد اللون'
        }
      }
    },
    {
      id: 'valencia-orange',
      categoryId: 'citrus',
      image: './assets/img/products/valencia-orange.webp',
      hsCode: '080510',
      season: { from: 3, to: 8 },
      available: true,
      packagingOptions: ['8 kg open-top carton', '15 kg carton', 'Mesh bags 10 kg', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '4–8 weeks (cold storage at 3–5°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Valencia Orange',
        description: 'Valencia Oranges are the premier juicing variety, prized for their exceptional juice content, thin skin, and balanced sweet-tart flavor. Egypt\'s warm climate produces Valencia oranges with superior Brix levels, making them ideal for both fresh consumption and juice processing.',
        varieties: ['Valencia Late', 'Midsweet', 'Delta Valencia'],
        specs: {
          caliber: '56–88 mm',
          brix: '12–15° Brix',
          color: 'Bright orange, smooth skin'
        }
      },
      ar: {
        name: 'برتقال فالنسيا',
        description: 'برتقال فالنسيا هو الصنف الأمثل للعصير، يتميز بمحتوى عصير استثنائي وقشرة رقيقة ونكهة متوازنة بين الحلاوة والحموضة. المناخ المصري الدافئ ينتج برتقال فالنسيا بمستويات بريكس عالية، مما يجعله مثالياً للاستهلاك الطازج وتصنيع العصائر.',
        varieties: ['فالنسيا ليت', 'ميدسويت', 'فالنسيا دلتا'],
        specs: {
          caliber: '٥٦–٨٨ مم',
          brix: '١٢–١٥° بريكس',
          color: 'برتقالي فاتح، قشرة ناعمة'
        }
      }
    },
    {
      id: 'mandarin',
      categoryId: 'citrus',
      image: './assets/img/products/mandarin.webp',
      hsCode: '080520',
      season: { from: 11, to: 3 },
      available: true,
      packagingOptions: ['5 kg carton', '10 kg carton', 'Mesh bags 5 kg', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '3–4 weeks (cold storage at 4–6°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Mandarin',
        description: 'Egyptian Mandarins are easy-peel citrus fruits with a rich, sweet aroma and juicy segments. Popular across European and Middle Eastern markets, they are an excellent snacking fruit prized for their convenience and refreshing taste.',
        varieties: ['Fremont', 'Murcott', 'Clementine'],
        specs: {
          caliber: '45–70 mm',
          brix: '10–13° Brix',
          color: 'Deep orange, glossy'
        }
      },
      ar: {
        name: 'يوسفي',
        description: 'اليوسفي المصري فاكهة حمضية سهلة التقشير بعطر غني حلو وفصوص عصيرية. محبوب في الأسواق الأوروبية والشرق أوسطية، وهو فاكهة ممتازة للتناول المباشر بفضل سهولته وطعمه المنعش.',
        varieties: ['فريمونت', 'موركوت', 'كلمنتينا'],
        specs: {
          caliber: '٤٥–٧٠ مم',
          brix: '١٠–١٣° بريكس',
          color: 'برتقالي غامق، لامع'
        }
      }
    },
    {
      id: 'lemon',
      categoryId: 'citrus',
      image: './assets/img/products/lemon.webp',
      hsCode: '080550',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['5 kg carton', '10 kg carton', 'Mesh bags 5 kg', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '4–6 weeks (cold storage at 8–10°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Lemon',
        description: 'Egyptian Adalia Lemons are available year-round thanks to Egypt\'s diverse growing regions. Known for their high juice content, bright yellow color, and pronounced acidity, they serve both fresh markets and industrial juice extraction.',
        varieties: ['Adalia', 'Eureka', 'Verna'],
        specs: {
          caliber: '45–70 mm',
          brix: '6–8° Brix',
          color: 'Bright yellow, uniform'
        }
      },
      ar: {
        name: 'ليمون أضاليا',
        description: 'الليمون المصري أضاليا متاح طوال العام بفضل تنوع مناطق الزراعة في مصر. يتميز بمحتوى عصير عالي ولون أصفر زاهي وحموضة واضحة، ويخدم أسواق الاستهلاك الطازج واستخلاص العصائر الصناعية.',
        varieties: ['أضاليا', 'يوريكا', 'فيرنا'],
        specs: {
          caliber: '٤٥–٧٠ مم',
          brix: '٦–٨° بريكس',
          color: 'أصفر زاهي، موحد اللون'
        }
      }
    },

    /* ── Fresh Fruits (6) ── */
    {
      id: 'grapes',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/grapes.webp',
      hsCode: '080610',
      season: { from: 5, to: 9 },
      available: true,
      packagingOptions: ['4.5 kg carton (punnet)', '8 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '3–5 weeks (cold storage at 0–2°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Table Grapes',
        description: 'Egypt is a leading global exporter of premium table grapes. Our grapes are cultivated in the desert reclamation areas with optimal sun exposure, resulting in exceptional sweetness and crunch. Varieties include seedless and seeded options for diverse market preferences.',
        varieties: ['Flame Seedless', 'Superior Seedless', 'Crimson Seedless', 'Red Globe'],
        specs: {
          caliber: '18–28 mm berry diameter',
          brix: '16–20° Brix',
          color: 'Varies by variety: red, green, or black'
        }
      },
      ar: {
        name: 'عنب',
        description: 'مصر من أكبر مصدري عنب المائدة الممتاز عالمياً. يُزرع عنبنا في مناطق استصلاح الصحراء بتعرض مثالي للشمس، مما ينتج حلاوة استثنائية وقرمشة. تشمل الأصناف خيارات بدون بذور وبالبذور لتلبية تفضيلات الأسواق المتنوعة.',
        varieties: ['فليم سيدلس', 'سوبيريور سيدلس', 'كريمسون سيدلس', 'ريد جلوب'],
        specs: {
          caliber: '١٨–٢٨ مم قطر الحبة',
          brix: '١٦–٢٠° بريكس',
          color: 'يختلف حسب الصنف: أحمر، أخضر، أو أسود'
        }
      }
    },
    {
      id: 'strawberry',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/strawberry.webp',
      hsCode: '081010',
      season: { from: 11, to: 4 },
      available: true,
      packagingOptions: ['250 g punnet', '400 g punnet', '2.5 kg flat', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp', 'organic'],
      shelfLife: '7–12 days (cold storage at 1–4°C)',
      minOrder: '10 MT (one 40ft reefer container)',
      en: {
        name: 'Fresh Strawberry',
        description: 'Egyptian strawberries are famous for their deep red color, intense aroma, and naturally sweet flavor. Grown primarily in the Qalyubia and Ismailia governorates, our strawberries are harvested at optimal ripeness and cooled within hours to preserve freshness for export.',
        varieties: ['Festival', 'Fortuna', 'Florida Beauty', 'Sweet Charlie'],
        specs: {
          caliber: '25–45 mm',
          brix: '7–10° Brix',
          color: 'Deep red, glossy'
        }
      },
      ar: {
        name: 'فراولة طازجة',
        description: 'الفراولة المصرية مشهورة بلونها الأحمر الداكن وعطرها القوي ونكهتها الحلوة الطبيعية. تُزرع بشكل رئيسي في محافظتي القليوبية والإسماعيلية، وتُحصد في ذروة النضج وتُبرد خلال ساعات للحفاظ على طزاجتها للتصدير.',
        varieties: ['فيستيفال', 'فورتونا', 'فلوريدا بيوتي', 'سويت تشارلي'],
        specs: {
          caliber: '٢٥–٤٥ مم',
          brix: '٧–١٠° بريكس',
          color: 'أحمر داكن، لامع'
        }
      }
    },
    {
      id: 'pomegranate',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/pomegranate.webp',
      hsCode: '081090',
      season: { from: 9, to: 1 },
      available: true,
      packagingOptions: ['3.5 kg carton', '5 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '6–8 weeks (cold storage at 5–7°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Pomegranate',
        description: 'Egyptian pomegranates are prized for their large size, vivid ruby-red arils, and balanced sweet-tart flavor. The Assiut and Fayoum regions produce some of the finest pomegranates, rich in antioxidants and naturally juicy.',
        varieties: ['Wonderful', 'Acco', 'Manfalouty'],
        specs: {
          caliber: '75–110 mm',
          brix: '14–17° Brix',
          color: 'Deep red exterior, ruby arils'
        }
      },
      ar: {
        name: 'رمان',
        description: 'الرمان المصري محبوب بحجمه الكبير وحباته الياقوتية الحمراء ونكهته المتوازنة بين الحلاوة والحموضة. تنتج مناطق أسيوط والفيوم أجود أنواع الرمان، الغني بمضادات الأكسدة والعصير الطبيعي.',
        varieties: ['وندرفول', 'أكو', 'منفلوطي'],
        specs: {
          caliber: '٧٥–١١٠ مم',
          brix: '١٤–١٧° بريكس',
          color: 'أحمر داكن من الخارج، حبات ياقوتية'
        }
      }
    },
    {
      id: 'mango',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/mango.webp',
      hsCode: '080450',
      season: { from: 6, to: 10 },
      available: true,
      packagingOptions: ['4 kg carton', '6 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '2–3 weeks (cold storage at 10–13°C)',
      minOrder: '15 MT (one 40ft reefer container)',
      en: {
        name: 'Mango',
        description: 'Egyptian mangoes are a tropical delight with rich, aromatic flesh and a smooth, fiberless texture. Grown in the Ismailia, Sharqia, and Upper Egypt regions, our mangoes are harvested at the perfect maturity stage for long-distance shipping while maintaining full flavor.',
        varieties: ['Keitt', 'Kent', 'Tommy Atkins', 'Naomi', 'Ewais'],
        specs: {
          caliber: '200–600 g per fruit',
          brix: '14–20° Brix',
          color: 'Green to yellow-red blush depending on variety'
        }
      },
      ar: {
        name: 'مانجو',
        description: 'المانجو المصري متعة استوائية بلب غني عطري وقوام ناعم خالي من الألياف. يُزرع في مناطق الإسماعيلية والشرقية وصعيد مصر، ويُحصد في مرحلة النضج المثالية للشحن لمسافات طويلة مع الحفاظ على النكهة الكاملة.',
        varieties: ['كيت', 'كينت', 'تومي أتكنز', 'ناعومي', 'عويسي'],
        specs: {
          caliber: '٢٠٠–٦٠٠ جرام للثمرة',
          brix: '١٤–٢٠° بريكس',
          color: 'أخضر إلى أصفر مع تورد حسب الصنف'
        }
      }
    },
    {
      id: 'guava',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/guava.webp',
      hsCode: '080450',
      season: { from: 9, to: 2 },
      available: true,
      packagingOptions: ['3 kg carton', '5 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '2–3 weeks (cold storage at 8–10°C)',
      minOrder: '15 MT (one 40ft reefer container)',
      en: {
        name: 'Guava',
        description: 'Egyptian guavas are intensely fragrant tropical fruits with creamy white or pink flesh. Rich in vitamin C, our guavas are grown in the warm Egyptian climate which enhances their natural sweetness and aroma. Available for fresh export and juice processing.',
        varieties: ['White Guava', 'Pink Guava', 'Banaaty'],
        specs: {
          caliber: '50–90 mm',
          brix: '8–12° Brix',
          color: 'Yellow-green exterior, white or pink flesh'
        }
      },
      ar: {
        name: 'جوافة',
        description: 'الجوافة المصرية فاكهة استوائية شديدة العطرية بلب أبيض كريمي أو وردي. غنية بفيتامين سي، تُزرع في المناخ المصري الدافئ الذي يعزز حلاوتها وعطرها الطبيعي. متاحة للتصدير الطازج وتصنيع العصائر.',
        varieties: ['جوافة بيضاء', 'جوافة وردية', 'بناتي'],
        specs: {
          caliber: '٥٠–٩٠ مم',
          brix: '٨–١٢° بريكس',
          color: 'أصفر مخضر من الخارج، أبيض أو وردي من الداخل'
        }
      }
    },
    {
      id: 'watermelon',
      categoryId: 'fresh-fruits',
      image: './assets/img/products/watermelon.webp',
      hsCode: '080711',
      season: { from: 4, to: 8 },
      available: true,
      packagingOptions: ['Bulk bin', 'Loose in container', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '3–4 weeks (cold storage at 7–10°C)',
      minOrder: '25 MT (one 40ft reefer container)',
      en: {
        name: 'Watermelon',
        description: 'Egyptian watermelons are large, sweet, and juicy — a summer staple exported in significant volumes. Grown in the sandy soils of Lower Egypt and Sinai, they develop high sugar content and a crisp, refreshing texture ideal for hot-climate markets.',
        varieties: ['Crimson Sweet', 'Charleston Gray', 'Seedless varieties'],
        specs: {
          caliber: '5–12 kg per fruit',
          brix: '10–13° Brix',
          color: 'Dark green striped exterior, bright red flesh'
        }
      },
      ar: {
        name: 'بطيخ',
        description: 'البطيخ المصري كبير الحجم حلو وعصيري — فاكهة صيفية أساسية تُصدّر بكميات كبيرة. يُزرع في الأراضي الرملية بالوجه البحري وسيناء، ويطور محتوى سكر عالي وقوام مقرمش منعش مثالي لأسواق المناخ الحار.',
        varieties: ['كريمسون سويت', 'تشارلستون جراي', 'أصناف بدون بذور'],
        specs: {
          caliber: '٥–١٢ كجم للثمرة',
          brix: '١٠–١٣° بريكس',
          color: 'أخضر داكن مخطط من الخارج، أحمر زاهي من الداخل'
        }
      }
    },

    /* ── Fresh Vegetables (8) ── */
    {
      id: 'potato',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/potato.webp',
      hsCode: '070190',
      season: { from: 1, to: 6 },
      available: true,
      packagingOptions: ['25 kg mesh bag', '50 kg mesh bag', '1250 kg big bag', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '4–6 months (cold storage at 4–8°C)',
      minOrder: '25 MT (one 40ft container)',
      en: {
        name: 'Fresh Potato',
        description: 'Egyptian potatoes are a cornerstone of the country\'s agricultural exports, with Egypt ranking among the top global exporters. Grown across the Delta region and new reclaimed lands, our potatoes are known for their clean skin, firm texture, and excellent cooking properties.',
        varieties: ['Spunta', 'Lady Rosetta', 'Diamont', 'Cara', 'Hermes'],
        specs: {
          caliber: '35–75 mm (sorting by customer specification)',
          brix: 'N/A',
          color: 'Yellow flesh, light brown skin'
        }
      },
      ar: {
        name: 'بطاطس',
        description: 'البطاطس المصرية ركيزة أساسية في صادرات مصر الزراعية، حيث تُصنف مصر ضمن أكبر المصدرين عالمياً. تُزرع في منطقة الدلتا والأراضي المستصلحة، وتتميز بقشرة نظيفة وقوام متماسك وخصائص طهي ممتازة.',
        varieties: ['سبونتا', 'ليدي روزيتا', 'ديامونت', 'كارا', 'هيرمس'],
        specs: {
          caliber: '٣٥–٧٥ مم (فرز حسب مواصفات العميل)',
          brix: 'غير متاح',
          color: 'لب أصفر، قشرة بنية فاتحة'
        }
      }
    },
    {
      id: 'onion-golden',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/onion-golden.webp',
      hsCode: '070310',
      season: { from: 1, to: 6 },
      available: true,
      packagingOptions: ['25 kg mesh bag', '50 kg mesh bag', '1250 kg big bag', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '3–6 months (dry storage, well-ventilated)',
      minOrder: '25 MT (one 40ft container)',
      en: {
        name: 'Golden Onion',
        description: 'Egyptian golden onions are prized in global markets for their pungent flavor, firm texture, and excellent shelf life. Egypt is a top-ten global onion exporter, with production centered in the Beheira, Fayoum, and Minya governorates.',
        varieties: ['Giza 20', 'Giza 6', 'Red Creole'],
        specs: {
          caliber: '40–80 mm',
          brix: 'N/A',
          color: 'Golden yellow, dry skin'
        }
      },
      ar: {
        name: 'بصل ذهبي',
        description: 'البصل الذهبي المصري محبوب عالمياً لنكهته القوية وقوامه المتماسك وفترة صلاحيته الممتازة. مصر من أكبر عشر دول مصدرة للبصل عالمياً، ويتركز الإنتاج في محافظات البحيرة والفيوم والمنيا.',
        varieties: ['جيزة ٢٠', 'جيزة ٦', 'ريد كريول'],
        specs: {
          caliber: '٤٠–٨٠ مم',
          brix: 'غير متاح',
          color: 'ذهبي أصفر، قشرة جافة'
        }
      }
    },
    {
      id: 'onion-red',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/onion-red.webp',
      hsCode: '070310',
      season: { from: 5, to: 8 },
      available: true,
      packagingOptions: ['25 kg mesh bag', '50 kg mesh bag', '1250 kg big bag', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '2–4 months (dry storage, well-ventilated)',
      minOrder: '25 MT (one 40ft container)',
      en: {
        name: 'Red Onion',
        description: 'Egyptian red onions feature a mild, slightly sweet flavor with a beautiful deep purple-red color. Popular in salads and fresh applications, they are cultivated across Upper Egypt and the Delta, offering consistent quality and size for export markets.',
        varieties: ['Red Creole', 'Giza Red', 'Bafla'],
        specs: {
          caliber: '40–80 mm',
          brix: 'N/A',
          color: 'Deep purple-red, dry skin'
        }
      },
      ar: {
        name: 'بصل أحمر',
        description: 'البصل الأحمر المصري يتميز بنكهة خفيفة حلوة قليلاً مع لون أرجواني أحمر جميل. محبوب في السلطات والاستخدامات الطازجة، ويُزرع في صعيد مصر والدلتا، ويقدم جودة وحجم متسقين لأسواق التصدير.',
        varieties: ['ريد كريول', 'جيزة أحمر', 'بفلة'],
        specs: {
          caliber: '٤٠–٨٠ مم',
          brix: 'غير متاح',
          color: 'أرجواني أحمر غامق، قشرة جافة'
        }
      }
    },
    {
      id: 'garlic',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/garlic.webp',
      hsCode: '070320',
      season: { from: 2, to: 7 },
      available: true,
      packagingOptions: ['10 kg carton', '20 kg mesh bag', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '4–6 months (cold storage at 0–2°C)',
      minOrder: '20 MT (one 40ft container)',
      en: {
        name: 'Fresh Garlic',
        description: 'Egyptian garlic is known for its strong aroma, robust flavor, and excellent storage quality. Grown in the Beni Suef and Minya regions, our garlic undergoes careful curing and sorting to meet international standards for size, cleanliness, and moisture content.',
        varieties: ['Egyptian White', 'Chinese-type', 'Sids 40'],
        specs: {
          caliber: '45–65 mm bulb diameter',
          brix: 'N/A',
          color: 'White to off-white, tight skin'
        }
      },
      ar: {
        name: 'ثوم',
        description: 'الثوم المصري معروف بعطره القوي ونكهته المتينة وجودة تخزينه الممتازة. يُزرع في مناطق بني سويف والمنيا، ويخضع لعملية تجفيف وفرز دقيقة لتلبية المعايير الدولية للحجم والنظافة ومحتوى الرطوبة.',
        varieties: ['أبيض مصري', 'صنف صيني', 'سدس ٤٠'],
        specs: {
          caliber: '٤٥–٦٥ مم قطر الرأس',
          brix: 'غير متاح',
          color: 'أبيض إلى أبيض مائل للكريمي، قشرة محكمة'
        }
      }
    },
    {
      id: 'sweet-potato',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/sweet-potato.webp',
      hsCode: '071420',
      season: { from: 9, to: 3 },
      available: true,
      packagingOptions: ['6 kg carton', '10 kg carton', '25 kg mesh bag', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '4–8 weeks (storage at 12–15°C)',
      minOrder: '20 MT (one 40ft container)',
      en: {
        name: 'Sweet Potato',
        description: 'Egyptian sweet potatoes have become a major export commodity, particularly to European markets. Their creamy orange flesh, natural sweetness, and versatility in cooking make them a favorite. Grown in the sandy soils of Beheira and Nubaria.',
        varieties: ['Beauregard', 'Bellevue', 'Murasaki'],
        specs: {
          caliber: '150–400 g per tuber',
          brix: '12–16° Brix',
          color: 'Orange flesh, reddish-brown skin'
        }
      },
      ar: {
        name: 'بطاطا حلوة',
        description: 'البطاطا الحلوة المصرية أصبحت سلعة تصدير رئيسية، خاصة للأسواق الأوروبية. لبها البرتقالي الكريمي وحلاوتها الطبيعية وتنوع استخداماتها في الطهي يجعلها مفضلة. تُزرع في الأراضي الرملية بالبحيرة والنوبارية.',
        varieties: ['بوريجارد', 'بيلفيو', 'موراساكي'],
        specs: {
          caliber: '١٥٠–٤٠٠ جرام للدرنة',
          brix: '١٢–١٦° بريكس',
          color: 'لب برتقالي، قشرة بنية محمرة'
        }
      }
    },
    {
      id: 'green-beans',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/green-beans.webp',
      hsCode: '070820',
      season: { from: 10, to: 5 },
      available: true,
      packagingOptions: ['4 kg carton', '6 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp'],
      shelfLife: '10–14 days (cold storage at 4–7°C)',
      minOrder: '10 MT (one 40ft reefer container)',
      en: {
        name: 'Green Beans',
        description: 'Egyptian green beans (French beans) are a premium export vegetable, especially popular in European markets. Hand-picked to ensure uniform size and freshness, they are known for their tender texture, bright green color, and clean snap when broken.',
        varieties: ['Bobby', 'Paulista', 'Fine Beans (Haricots Verts)'],
        specs: {
          caliber: '6–9 mm diameter, 10–14 cm length',
          brix: 'N/A',
          color: 'Bright green, uniform'
        }
      },
      ar: {
        name: 'فاصوليا خضراء',
        description: 'الفاصوليا الخضراء المصرية (الفرنسية) خضار تصدير ممتاز، محبوبة خاصة في الأسواق الأوروبية. تُقطف يدوياً لضمان تجانس الحجم والطزاجة، وتتميز بقوامها الطري ولونها الأخضر الزاهي وقرمشتها النظيفة عند الكسر.',
        varieties: ['بوبي', 'بوليستا', 'فاصوليا رفيعة (هاريكو فير)'],
        specs: {
          caliber: '٦–٩ مم قطر، ١٠–١٤ سم طول',
          brix: 'غير متاح',
          color: 'أخضر زاهي، موحد'
        }
      }
    },
    {
      id: 'pepper',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/pepper.webp',
      hsCode: '070960',
      season: { from: 10, to: 5 },
      available: true,
      packagingOptions: ['5 kg carton', '7 kg carton', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '2–3 weeks (cold storage at 7–10°C)',
      minOrder: '15 MT (one 40ft reefer container)',
      en: {
        name: 'Bell Pepper',
        description: 'Egyptian bell peppers are vibrant, thick-walled sweet peppers available in green, red, yellow, and orange colors. Grown in greenhouse and open-field conditions, they offer excellent flavor, crunch, and visual appeal for retail and food service markets.',
        varieties: ['California Wonder', 'Colored varieties (red, yellow, orange)'],
        specs: {
          caliber: '70–110 mm',
          brix: '5–8° Brix',
          color: 'Green, red, yellow, or orange'
        }
      },
      ar: {
        name: 'فلفل رومي',
        description: 'الفلفل الرومي المصري فلفل حلو زاهي سميك الجدران متاح بالألوان الأخضر والأحمر والأصفر والبرتقالي. يُزرع في الصوب الزراعية والحقول المكشوفة، ويقدم نكهة ممتازة وقرمشة وجاذبية بصرية لأسواق التجزئة والخدمات الغذائية.',
        varieties: ['كاليفورنيا وندر', 'أصناف ملونة (أحمر، أصفر، برتقالي)'],
        specs: {
          caliber: '٧٠–١١٠ مم',
          brix: '٥–٨° بريكس',
          color: 'أخضر، أحمر، أصفر، أو برتقالي'
        }
      }
    },
    {
      id: 'tomato',
      categoryId: 'fresh-vegetables',
      image: './assets/img/products/tomato.webp',
      hsCode: '070200',
      season: { from: 11, to: 6 },
      available: true,
      packagingOptions: ['5 kg carton', '7 kg carton', 'Bulk bin', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000'],
      shelfLife: '2–3 weeks (cold storage at 10–13°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Fresh Tomato',
        description: 'Egyptian tomatoes are exported in large volumes, valued for their firm structure, rich color, and versatile use. Grown in diverse climatic zones from the Delta to Upper Egypt, our tomatoes meet the strictest European and Gulf quality standards.',
        varieties: ['Cherry Tomato', 'Roma (Plum)', 'Round (Beef)', 'Cluster (Vine)'],
        specs: {
          caliber: '40–80 mm (round); 20–30 mm (cherry)',
          brix: '4–7° Brix',
          color: 'Bright red to deep red'
        }
      },
      ar: {
        name: 'طماطم',
        description: 'الطماطم المصرية تُصدّر بكميات كبيرة وتُقدّر لبنيتها المتماسكة ولونها الغني وتنوع استخداماتها. تُزرع في مناطق مناخية متنوعة من الدلتا إلى صعيد مصر، وتلبي أشد معايير الجودة الأوروبية والخليجية صرامة.',
        varieties: ['طماطم شيري', 'روما (بلم)', 'مستديرة (بيف)', 'عنقودية (فاين)'],
        specs: {
          caliber: '٤٠–٨٠ مم (مستديرة)؛ ٢٠–٣٠ مم (شيري)',
          brix: '٤–٧° بريكس',
          color: 'أحمر فاتح إلى أحمر داكن'
        }
      }
    },

    /* ── Frozen (3) ── */
    {
      id: 'frozen-strawberry',
      categoryId: 'frozen',
      image: './assets/img/products/frozen-strawberry.webp',
      hsCode: '081110',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['10 kg poly bag in carton', '20 kg bulk', 'Custom packaging'],
      certifications: ['globalgap', 'iso22000', 'haccp', 'fssc22000'],
      shelfLife: '24 months (storage at -18°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Frozen Strawberry (IQF)',
        description: 'Our IQF (Individually Quick Frozen) strawberries retain the full flavor, color, and nutritional value of fresh strawberries. Processed within hours of harvest, each berry is flash-frozen individually to prevent clumping. Available year-round for juice, dairy, bakery, and retail applications.',
        varieties: ['Festival', 'Fortuna'],
        specs: {
          caliber: '15–35 mm (whole), diced, sliced available',
          brix: '7–9° Brix (pre-freeze)',
          color: 'Deep red, natural'
        }
      },
      ar: {
        name: 'فراولة مجمدة',
        description: 'فراولتنا المجمدة بتقنية IQF (التجميد السريع الفردي) تحتفظ بالنكهة الكاملة واللون والقيمة الغذائية للفراولة الطازجة. تُعالج خلال ساعات من الحصاد، وتُجمد كل حبة بشكل فردي لمنع التكتل. متاحة طوال العام للعصائر والألبان والمخبوزات وتجارة التجزئة.',
        varieties: ['فيستيفال', 'فورتونا'],
        specs: {
          caliber: '١٥–٣٥ مم (كاملة)، مكعبات وشرائح متاحة',
          brix: '٧–٩° بريكس (قبل التجميد)',
          color: 'أحمر داكن، طبيعي'
        }
      }
    },
    {
      id: 'frozen-green-beans',
      categoryId: 'frozen',
      image: './assets/img/products/frozen-green-beans.webp',
      hsCode: '071022',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['10 kg poly bag in carton', '20 kg bulk', 'Custom packaging'],
      certifications: ['iso22000', 'haccp', 'fssc22000'],
      shelfLife: '24 months (storage at -18°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Frozen Green Beans (IQF)',
        description: 'IQF frozen green beans are blanched and flash-frozen to lock in their fresh taste, bright color, and nutritional value. Cut or whole, they provide convenient year-round availability for food processing, catering, and retail sectors.',
        varieties: ['Bobby cut', 'Whole fine beans'],
        specs: {
          caliber: '6–9 mm diameter, cut 2–4 cm or whole',
          brix: 'N/A',
          color: 'Bright green, natural'
        }
      },
      ar: {
        name: 'فاصوليا خضراء مجمدة',
        description: 'الفاصوليا الخضراء المجمدة بتقنية IQF تُسلق وتُجمد بسرعة للحفاظ على طعمها الطازج ولونها الزاهي وقيمتها الغذائية. مقطعة أو كاملة، توفر إتاحة مريحة طوال العام لقطاعات تصنيع الغذاء والتموين والتجزئة.',
        varieties: ['بوبي مقطعة', 'فاصوليا رفيعة كاملة'],
        specs: {
          caliber: '٦–٩ مم قطر، مقطعة ٢–٤ سم أو كاملة',
          brix: 'غير متاح',
          color: 'أخضر زاهي، طبيعي'
        }
      }
    },
    {
      id: 'frozen-peas',
      categoryId: 'frozen',
      image: './assets/img/products/frozen-peas.webp',
      hsCode: '071021',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['10 kg poly bag in carton', '20 kg bulk', 'Custom packaging'],
      certifications: ['iso22000', 'haccp', 'fssc22000'],
      shelfLife: '24 months (storage at -18°C)',
      minOrder: '20 MT (one 40ft reefer container)',
      en: {
        name: 'Frozen Green Peas (IQF)',
        description: 'Our IQF green peas are harvested young and tender, then blanched and frozen within hours to preserve their sweet taste and vibrant green color. A staple in frozen food import markets, our peas meet stringent European food safety standards.',
        varieties: ['Garden Peas', 'Petit Pois'],
        specs: {
          caliber: '7–10 mm diameter',
          brix: 'N/A',
          color: 'Bright green, uniform'
        }
      },
      ar: {
        name: 'بسلة خضراء مجمدة',
        description: 'بسلتنا المجمدة بتقنية IQF تُحصد صغيرة وطرية، ثم تُسلق وتُجمد خلال ساعات للحفاظ على طعمها الحلو ولونها الأخضر الزاهي. منتج أساسي في أسواق استيراد الأغذية المجمدة، وتلبي معايير سلامة الغذاء الأوروبية الصارمة.',
        varieties: ['بسلة حدائق', 'بتي بوا'],
        specs: {
          caliber: '٧–١٠ مم قطر',
          brix: 'غير متاح',
          color: 'أخضر زاهي، موحد'
        }
      }
    },

    /* ── Herbs & Spices (2) ── */
    {
      id: 'basil',
      categoryId: 'herbs-spices',
      image: './assets/img/products/basil.webp',
      hsCode: '121190',
      season: { from: 4, to: 11 },
      available: true,
      packagingOptions: ['150 g bunch', '250 g clamshell', '1 kg bulk', 'Custom packaging'],
      certifications: ['globalgap', 'organic'],
      shelfLife: '7–10 days (cold storage at 8–12°C)',
      minOrder: '2 MT (air freight)',
      en: {
        name: 'Fresh Basil',
        description: 'Egyptian fresh basil is aromatic, intensely flavored, and grown under ideal sun conditions that enhance its essential oil content. Primarily exported by air freight to European markets, our basil is harvested early morning and pre-cooled immediately for maximum shelf life.',
        varieties: ['Sweet Basil (Genovese)', 'Thai Basil', 'Purple Basil'],
        specs: {
          caliber: '15–25 cm stem length',
          brix: 'N/A',
          color: 'Vibrant green, aromatic'
        }
      },
      ar: {
        name: 'ريحان طازج',
        description: 'الريحان الطازج المصري عطري ومكثف النكهة ويُزرع تحت ظروف شمس مثالية تعزز محتوى زيوته العطرية. يُصدّر بشكل رئيسي جواً إلى الأسواق الأوروبية، ويُحصد في الصباح الباكر ويُبرد فوراً لأقصى فترة صلاحية.',
        varieties: ['ريحان حلو (جنوفيزي)', 'ريحان تايلاندي', 'ريحان بنفسجي'],
        specs: {
          caliber: '١٥–٢٥ سم طول الساق',
          brix: 'غير متاح',
          color: 'أخضر زاهي، عطري'
        }
      }
    },
    {
      id: 'chamomile',
      categoryId: 'herbs-spices',
      image: './assets/img/products/chamomile.webp',
      hsCode: '121190',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['25 kg bale', '50 kg bale', 'Custom packaging'],
      certifications: ['organic', 'iso22000'],
      shelfLife: '24 months (dry storage)',
      minOrder: '5 MT',
      en: {
        name: 'Dried Chamomile',
        description: 'Egypt is the world\'s largest exporter of dried chamomile flowers. Our chamomile is grown in the Fayoum region under organic conditions, hand-harvested, and naturally sun-dried. Known for its golden color, sweet apple-like aroma, and high essential oil content.',
        varieties: ['German Chamomile (Matricaria chamomilla)'],
        specs: {
          caliber: 'Dried flowers, whole head',
          brix: 'N/A',
          color: 'Golden yellow with white petals'
        }
      },
      ar: {
        name: 'بابونج مجفف',
        description: 'مصر أكبر مصدر لزهور البابونج المجفف في العالم. بابونجنا يُزرع في منطقة الفيوم بظروف عضوية، ويُحصد يدوياً ويُجفف طبيعياً بالشمس. معروف بلونه الذهبي وعطره الحلو الشبيه بالتفاح ومحتواه العالي من الزيوت العطرية.',
        varieties: ['بابونج ألماني (ماتريكاريا كاموميلا)'],
        specs: {
          caliber: 'زهور مجففة، رأس كامل',
          brix: 'غير متاح',
          color: 'ذهبي أصفر مع بتلات بيضاء'
        }
      }
    },

    /* ── Dry Goods (1) ── */
    {
      id: 'dry-white-beans',
      categoryId: 'dry-goods',
      image: './assets/img/products/dry-white-beans.webp',
      hsCode: '071331',
      season: { from: 1, to: 12 },
      available: true,
      packagingOptions: ['25 kg PP bag', '50 kg PP bag', '1 MT big bag', 'Custom packaging'],
      certifications: ['iso22000', 'haccp'],
      shelfLife: '18–24 months (dry storage)',
      minOrder: '25 MT (one 40ft container)',
      en: {
        name: 'Dried White Beans',
        description: 'Egyptian dried white beans (navy beans / haricot beans) are a staple pulse export. Machine-sorted for uniform size and color, our beans are free from foreign matter and broken pieces. They are high in protein, fiber, and minerals, making them a nutritious food commodity for global markets.',
        varieties: ['Navy Beans', 'Haricot Beans', 'Alubia'],
        specs: {
          caliber: '6–10 mm',
          brix: 'N/A',
          color: 'White to cream, uniform'
        }
      },
      ar: {
        name: 'فاصوليا بيضاء مجففة',
        description: 'الفاصوليا البيضاء المجففة المصرية سلعة بقولية تصديرية أساسية. مفرزة آلياً لتجانس الحجم واللون، وخالية من الشوائب والقطع المكسورة. غنية بالبروتين والألياف والمعادن، مما يجعلها سلعة غذائية مغذية للأسواق العالمية.',
        varieties: ['فاصوليا نيفي', 'هاريكو', 'ألوبيا'],
        specs: {
          caliber: '٦–١٠ مم',
          brix: 'غير متاح',
          color: 'أبيض إلى كريمي، موحد'
        }
      }
    }
  ];

  /* ── Certifications (5) ── */

  var certifications = [
    {
      id: 'globalgap',
      logo: './assets/img/certifications/globalgap.webp',
      en: { name: 'GlobalGAP', desc: 'Good Agricultural Practices certification ensuring food safety, sustainability, and traceability from farm to fork.' },
      ar: { name: 'جلوبال جاب', desc: 'شهادة الممارسات الزراعية الجيدة التي تضمن سلامة الغذاء والاستدامة والتتبع من المزرعة إلى المائدة.' }
    },
    {
      id: 'iso22000',
      logo: './assets/img/certifications/iso22000.webp',
      en: { name: 'ISO 22000', desc: 'International food safety management system standard, ensuring systematic identification and control of food safety hazards.' },
      ar: { name: 'أيزو ٢٢٠٠٠', desc: 'معيار دولي لنظام إدارة سلامة الغذاء، يضمن التحديد والتحكم المنهجي في مخاطر سلامة الغذاء.' }
    },
    {
      id: 'haccp',
      logo: './assets/img/certifications/haccp.webp',
      en: { name: 'HACCP', desc: 'Hazard Analysis and Critical Control Points — a preventive approach to food safety that identifies potential hazards and controls them at critical points.' },
      ar: { name: 'هاسب', desc: 'تحليل المخاطر ونقاط التحكم الحرجة — نهج وقائي لسلامة الغذاء يحدد المخاطر المحتملة ويتحكم فيها عند النقاط الحرجة.' }
    },
    {
      id: 'fssc22000',
      logo: './assets/img/certifications/fssc22000.webp',
      en: { name: 'FSSC 22000', desc: 'Food Safety System Certification recognized by the Global Food Safety Initiative (GFSI), combining ISO 22000 with additional requirements for food manufacturing.' },
      ar: { name: 'إف إس إس سي ٢٢٠٠٠', desc: 'شهادة نظام سلامة الغذاء المعتمدة من المبادرة العالمية لسلامة الغذاء (GFSI)، تجمع بين أيزو ٢٢٠٠٠ ومتطلبات إضافية لتصنيع الغذاء.' }
    },
    {
      id: 'organic',
      logo: './assets/img/certifications/organic.webp',
      en: { name: 'Organic Certified', desc: 'Certification verifying that products are grown without synthetic pesticides, fertilizers, or GMOs, following organic farming standards.' },
      ar: { name: 'شهادة عضوي', desc: 'شهادة تثبت أن المنتجات مزروعة بدون مبيدات صناعية أو أسمدة كيميائية أو كائنات معدلة وراثياً، وفق معايير الزراعة العضوية.' }
    }
  ];

  /* ── FAQ (6) ── */

  var faq = [
    {
      en: {
        question: 'What products does Firdaws export?',
        answer: 'Firdaws Import & Export Co. specializes in sorting, packing, and exporting premium Egyptian agricultural products including citrus fruits, fresh fruits, fresh vegetables, frozen products (IQF), herbs & spices, and dry goods & grains. We export over 24 products across 6 categories to global markets.'
      },
      ar: {
        question: 'ما هي المنتجات التي يصدرها الفردوس؟',
        answer: 'مؤسسة الفردوس للاستيراد والتصدير متخصصة في فرز وتعبئة وتصدير المحاصيل الزراعية المصرية الممتازة تشمل الحمضيات والفواكه الطازجة والخضروات الطازجة والمنتجات المجمدة (IQF) والأعشاب والتوابل والحبوب والبقوليات. نصدّر أكثر من ٢٤ منتج في ٦ فئات للأسواق العالمية.'
      }
    },
    {
      en: {
        question: 'What is the minimum order quantity?',
        answer: 'Minimum order quantities vary by product. For most fresh products, the minimum order is one 40ft reefer container (approximately 20–25 MT). For herbs shipped by air, the minimum can be as low as 2 MT. For dried goods, the minimum is typically 5–25 MT. Contact us for specific product MOQs.'
      },
      ar: {
        question: 'ما هو الحد الأدنى للطلب؟',
        answer: 'تختلف الحدود الدنيا للطلب حسب المنتج. لمعظم المنتجات الطازجة، الحد الأدنى هو حاوية مبردة ٤٠ قدم (تقريباً ٢٠–٢٥ طن). للأعشاب المشحونة جواً، الحد الأدنى قد يكون ٢ طن. للسلع الجافة، الحد الأدنى عادة ٥–٢٥ طن. تواصلوا معنا لمعرفة الحد الأدنى لكل منتج.'
      }
    },
    {
      en: {
        question: 'Do you offer custom packaging?',
        answer: 'Yes, we offer fully customizable packaging solutions including private labeling, custom carton sizes, branded mesh bags, and retail-ready punnets. Our packaging facility can accommodate specific market requirements and retailer specifications.'
      },
      ar: {
        question: 'هل توفرون تعبئة مخصصة؟',
        answer: 'نعم، نوفر حلول تعبئة قابلة للتخصيص بالكامل تشمل وضع العلامة التجارية الخاصة وأحجام كراتين مخصصة وأكياس شبكية مطبوعة وعبوات جاهزة للبيع بالتجزئة. منشأة التعبئة لدينا تستوعب متطلبات أسواق محددة ومواصفات تجار التجزئة.'
      }
    },
    {
      en: {
        question: 'Which quality certifications do you hold?',
        answer: 'We hold five internationally recognized certifications: GlobalGAP (Good Agricultural Practices), ISO 22000 (Food Safety Management), HACCP (Hazard Analysis & Critical Control Points), FSSC 22000 (Food Safety System Certification), and Organic Certification. These ensure our products meet the highest global food safety and quality standards.'
      },
      ar: {
        question: 'ما هي شهادات الجودة التي تحملونها؟',
        answer: 'نحمل خمس شهادات معترف بها دولياً: جلوبال جاب (الممارسات الزراعية الجيدة)، أيزو ٢٢٠٠٠ (إدارة سلامة الغذاء)، هاسب (تحليل المخاطر ونقاط التحكم الحرجة)، إف إس إس سي ٢٢٠٠٠ (نظام سلامة الغذاء)، وشهادة العضوي. هذه تضمن أن منتجاتنا تلبي أعلى معايير سلامة وجودة الغذاء العالمية.'
      }
    },
    {
      en: {
        question: 'How can I request a price quotation?',
        answer: 'You can request a quotation by clicking the "Request a Quote" button on any product page, which opens a WhatsApp conversation with our export team. Alternatively, you can contact us via our Contact page, email us at info@firdawsco.com, or call us directly. Please include the product name, required quantity, destination country, and desired delivery timeframe.'
      },
      ar: {
        question: 'كيف يمكنني طلب عرض سعر؟',
        answer: 'يمكنكم طلب عرض سعر بالضغط على زر "طلب عرض سعر" في أي صفحة منتج، مما يفتح محادثة واتساب مع فريق التصدير لدينا. بدلاً من ذلك، يمكنكم التواصل عبر صفحة اتصل بنا أو مراسلتنا على info@firdawsco.com أو الاتصال مباشرة. يرجى تضمين اسم المنتج والكمية المطلوبة ودولة الوجهة والإطار الزمني للتسليم المرغوب.'
      }
    },
    {
      en: {
        question: 'Which countries do you export to?',
        answer: 'We export to markets across Europe, the Middle East, Asia, and Africa. Our key export destinations include the European Union (Netherlands, Germany, UK, Italy), Gulf Cooperation Council countries (Saudi Arabia, UAE, Kuwait), Russia, India, and several African nations. We are always open to exploring new markets.'
      },
      ar: {
        question: 'إلى أي دول تُصدّرون؟',
        answer: 'نصدّر إلى أسواق في أوروبا والشرق الأوسط وآسيا وأفريقيا. تشمل وجهات التصدير الرئيسية الاتحاد الأوروبي (هولندا وألمانيا وبريطانيا وإيطاليا) ودول مجلس التعاون الخليجي (السعودية والإمارات والكويت) وروسيا والهند وعدة دول أفريقية. نحن دائماً منفتحون على استكشاف أسواق جديدة.'
      }
    }
  ];

  /* ── Constants ── */

  var WHATSAPP_NUMBER = '201209500578';
  var PHONE_NUMBER    = '201010018811';
  var DOMAIN          = 'firdawsco.com';

  var BRAND_NAME = {
    en: 'Firdaws Import & Export Co.',
    ar: 'مؤسسة الفردوس للاستيراد والتصدير'
  };

  var ADDRESS = {
    en: 'Manshyet Ganzour, Tanta, Gharbia Governorate, Egypt',
    ar: 'منشية جنزور — طنطا — محافظة الغربية — مصر'
  };

  var SOCIAL_LINKS = [];

  /* ── META — All UI Strings (bilingual) ── */

  var META = {
    ogImage: '/assets/img/og-image.png',
    supportEmail: 'info@firdawsco.com',
    foundingYear: '2020',
    logoPath: '/assets/img/logo.webp',
    legalLastUpdated: '2026-04-01',
    defaultLang: 'en',
    commercialRegister: '57874',
    taxId: '841-604-777',

    tagline: {
      en: 'Premium Egyptian Agricultural Exports',
      ar: 'صادرات زراعية مصرية ممتازة'
    },

    description: {
      en: 'Firdaws Import & Export Co. specializes in sorting, packing, and exporting premium Egyptian agricultural products — fresh fruits, vegetables, frozen goods, herbs, and dry goods — to global markets with internationally recognized quality certifications.',
      ar: 'مؤسسة الفردوس للاستيراد والتصدير متخصصة في فرز وتعبئة وتصدير المحاصيل الزراعية المصرية الممتازة — فواكه وخضروات طازجة ومنتجات مجمدة وأعشاب وحبوب — للأسواق العالمية بشهادات جودة معترف بها دولياً.'
    },

    nav: {
      home:     { en: 'Home',       ar: 'الرئيسية' },
      products: { en: 'Products',   ar: 'المنتجات' },
      about:    { en: 'About Us',   ar: 'من نحن' },
      contact:  { en: 'Contact',    ar: 'تواصل معنا' },
      quote:    { en: 'Get a Quote', ar: 'طلب عرض سعر' }
    },

    hero: {
      title:        { en: 'From Egypt\'s Fertile Land to the World\'s Table', ar: 'من أرض مصر الخصبة إلى موائد العالم' },
      subtitle:     { en: 'Premium quality agricultural exports — fresh fruits, vegetables, and frozen products — sorted, packed, and shipped with internationally certified standards.', ar: 'صادرات زراعية ممتازة الجودة — فواكه وخضروات طازجة ومنتجات مجمدة — مفرزة ومعبأة ومشحونة بمعايير معتمدة دولياً.' },
      cta:          { en: 'Explore Products', ar: 'استعرض المنتجات' },
      ctaSecondary: { en: 'Request a Quote', ar: 'طلب عرض سعر' }
    },

    aboutPreview: {
      title: { en: 'Why Firdaws?', ar: 'لماذا الفردوس؟' },
      text:  { en: 'With deep roots in Egypt\'s agricultural heartland, Firdaws Import & Export Co. combines decades of farming expertise with modern sorting and packing facilities. We are committed to delivering the freshest, highest-quality produce to international markets — every shipment, every season.', ar: 'بجذور عميقة في قلب مصر الزراعي، تجمع مؤسسة الفردوس للاستيراد والتصدير بين عقود من الخبرة الزراعية ومرافق فرز وتعبئة حديثة. نلتزم بتقديم أطزج وأجود المنتجات الزراعية للأسواق الدولية — في كل شحنة، كل موسم.' }
    },

    productsSection: {
      title:     { en: 'Our Products',         ar: 'منتجاتنا' },
      subtitle:  { en: 'Explore our range of premium Egyptian agricultural products, from sun-ripened citrus to farm-fresh vegetables.', ar: 'اكتشف مجموعتنا من المحاصيل الزراعية المصرية الممتازة، من الحمضيات الناضجة بالشمس إلى الخضروات الطازجة من المزرعة.' },
      viewAll:   { en: 'View All Products',    ar: 'عرض كل المنتجات' },
      filter:    { en: 'Filter by Category',   ar: 'تصفية حسب الفئة' },
      all:       { en: 'All Products',         ar: 'كل المنتجات' },
      inSeason:  { en: 'In Season',            ar: 'في الموسم' },
      offSeason: { en: 'Off Season',           ar: 'خارج الموسم' }
    },

    seasonCalendar: {
      title:    { en: 'Season Calendar',  ar: 'تقويم المواسم' },
      subtitle: { en: 'See when each product is available for export throughout the year.', ar: 'اعرف متى يكون كل منتج متاحاً للتصدير على مدار العام.' },
      product:  { en: 'Product',          ar: 'المنتج' },
      months: {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      }
    },

    certificationsSection: {
      title:    { en: 'Quality Certifications',  ar: 'شهادات الجودة' },
      subtitle: { en: 'Internationally recognized certifications ensuring the highest food safety and quality standards.', ar: 'شهادات معترف بها دولياً تضمن أعلى معايير سلامة وجودة الغذاء.' }
    },

    ctaSection: {
      title: { en: 'Ready to Import Premium Egyptian Produce?',  ar: 'مستعد لاستيراد محاصيل مصرية ممتازة؟' },
      text:  { en: 'Contact our export team today for pricing, availability, and shipping details. We\'re here to build lasting trade partnerships.', ar: 'تواصل مع فريق التصدير لدينا اليوم للحصول على الأسعار والتوافر وتفاصيل الشحن. نحن هنا لبناء شراكات تجارية دائمة.' },
      btn:   { en: 'Get in Touch',  ar: 'تواصل معنا' }
    },

    productDetails: {
      specifications:  { en: 'Specifications',       ar: 'المواصفات' },
      caliber:         { en: 'Caliber / Size',        ar: 'الحجم / القياس' },
      brix:            { en: 'Brix Level',            ar: 'درجة البريكس' },
      color:           { en: 'Color',                 ar: 'اللون' },
      packaging:       { en: 'Packaging Options',     ar: 'خيارات التعبئة' },
      season:          { en: 'Season',                ar: 'الموسم' },
      shelfLife:       { en: 'Shelf Life',            ar: 'فترة الصلاحية' },
      minOrder:        { en: 'Minimum Order',         ar: 'الحد الأدنى للطلب' },
      varieties:       { en: 'Varieties',             ar: 'الأصناف' },
      certifications:  { en: 'Certifications',        ar: 'الشهادات' },
      hsCode:          { en: 'HS Code',               ar: 'الرمز الجمركي' },
      requestQuote:    { en: 'Request a Quote',       ar: 'طلب عرض سعر' },
      relatedProducts: { en: 'Related Products',      ar: 'منتجات ذات صلة' },
      backToProducts:  { en: 'Back to Products',      ar: 'العودة للمنتجات' }
    },

    aboutPage: {
      title: { en: 'About Firdaws', ar: 'عن الفردوس' },
      story: {
        title: { en: 'Our Story', ar: 'قصتنا' },
        text:  { en: 'Founded in Tanta, in the heart of Egypt\'s Gharbia Governorate, Firdaws Import & Export Co. began as a family passion for Egyptian agriculture. Today, under the leadership of Mahmoud Shalaby, we have grown into a trusted export partner serving international markets with premium-quality fresh fruits, vegetables, frozen products, herbs, and dry goods.', ar: 'تأسست في طنطا، في قلب محافظة الغربية بمصر، بدأت مؤسسة الفردوس للاستيراد والتصدير كشغف عائلي بالزراعة المصرية. اليوم، تحت قيادة محمود شلبي، نمونا لنصبح شريك تصدير موثوق يخدم الأسواق الدولية بأجود الفواكه والخضروات الطازجة والمنتجات المجمدة والأعشاب والحبوب.' }
      },
      mission: {
        title: { en: 'Our Mission', ar: 'مهمتنا' },
        text:  { en: 'To deliver Egypt\'s finest agricultural products to the world, maintaining the highest standards of quality, safety, and reliability in every shipment.', ar: 'تقديم أجود المنتجات الزراعية المصرية للعالم، مع الحفاظ على أعلى معايير الجودة والسلامة والموثوقية في كل شحنة.' }
      },
      values: {
        title: { en: 'Our Values', ar: 'قيمنا' },
        items: [
          { en: { title: 'Quality First',       text: 'Every product is inspected, sorted, and packed to meet international export standards.' },
            ar: { title: 'الجودة أولاً',         text: 'كل منتج يُفحص ويُفرز ويُعبأ لتلبية معايير التصدير الدولية.' } },
          { en: { title: 'Reliability',          text: 'Consistent supply, on-time delivery, and transparent communication with every partner.' },
            ar: { title: 'الموثوقية',             text: 'إمداد مستمر وتسليم في الموعد وتواصل شفاف مع كل شريك.' } },
          { en: { title: 'Sustainability',       text: 'Responsible farming practices that protect Egypt\'s agricultural resources for future generations.' },
            ar: { title: 'الاستدامة',             text: 'ممارسات زراعية مسؤولة تحمي موارد مصر الزراعية للأجيال القادمة.' } },
          { en: { title: 'Global Partnerships',  text: 'Building long-term trade relationships based on trust, quality, and mutual growth.' },
            ar: { title: 'شراكات عالمية',         text: 'بناء علاقات تجارية طويلة الأمد قائمة على الثقة والجودة والنمو المتبادل.' } }
        ]
      },
      facilities: {
        title: { en: 'Our Facilities', ar: 'منشآتنا' },
        text:  { en: 'Our state-of-the-art sorting and packing facility in Tanta is equipped with modern grading lines, cold storage rooms, and quality control laboratories. We maintain full traceability from farm to port, ensuring every shipment meets the strictest food safety standards.', ar: 'منشأة الفرز والتعبئة الحديثة في طنطا مجهزة بخطوط فرز متطورة وغرف تبريد ومعامل مراقبة جودة. نحافظ على التتبع الكامل من المزرعة إلى الميناء، لضمان أن كل شحنة تلبي أشد معايير سلامة الغذاء صرامة.' }
      }
    },

    contactPage: {
      title:    { en: 'Contact Us',                        ar: 'تواصل معنا' },
      subtitle: { en: 'Ready to start importing? Get in touch with our export team.', ar: 'مستعد لبدء الاستيراد؟ تواصل مع فريق التصدير لدينا.' },
      form: {
        name:    { en: 'Full Name',          ar: 'الاسم الكامل' },
        email:   { en: 'Email Address',      ar: 'البريد الإلكتروني' },
        company: { en: 'Company Name',       ar: 'اسم الشركة' },
        country: { en: 'Country',            ar: 'الدولة' },
        product: { en: 'Product of Interest', ar: 'المنتج المطلوب' },
        message: { en: 'Message',            ar: 'الرسالة' },
        submit:  { en: 'Send Message',       ar: 'إرسال الرسالة' }
      },
      info: {
        address:  { en: 'Address',   ar: 'العنوان' },
        phone:    { en: 'Phone',     ar: 'الهاتف' },
        whatsapp: { en: 'WhatsApp',  ar: 'واتساب' },
        email:    { en: 'Email',     ar: 'البريد الإلكتروني' }
      }
    },

    footer: {
      tagline:    { en: 'Sorting, packing & exporting premium Egyptian agricultural products to the world.', ar: 'فرز وتعبئة وتصدير المحاصيل الزراعية المصرية الممتازة للعالم.' },
      quickLinks: { en: 'Quick Links',  ar: 'روابط سريعة' },
      categories: { en: 'Categories',   ar: 'الفئات' },
      contact:    { en: 'Contact Info', ar: 'معلومات التواصل' },
      copyright:  { en: '\u00A9 {year} Firdaws Import & Export Co. All rights reserved.', ar: '\u00A9 {year} مؤسسة الفردوس للاستيراد والتصدير. جميع الحقوق محفوظة.' }
    },

    whatsapp: {
      general: { en: 'Hello! I\'m interested in importing Egyptian agricultural products. Could you please provide more details?', ar: 'مرحباً! أنا مهتم باستيراد منتجات زراعية مصرية. هل يمكنكم تزويدي بمزيد من التفاصيل؟' },
      product: { en: 'Hello! I\'m interested in importing {product}. Could you please send me a quotation?', ar: 'مرحباً! أنا مهتم باستيراد {product}. هل يمكنكم إرسال عرض سعر؟' }
    },

    legal: {
      privacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
      terms:   { en: 'Terms of Use',   ar: 'شروط الاستخدام' }
    },

    langSwitch: {
      en: 'العربية',
      ar: 'English'
    },

    notFound: {
      title:  { en: 'Page Not Found',                    ar: 'الصفحة غير موجودة' },
      text:   { en: 'The page you\'re looking for doesn\'t exist or has been moved.', ar: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' },
      goBack: { en: 'Go to Homepage',                    ar: 'العودة للرئيسية' }
    },

    backToTop: {
      en: 'Back to top',
      ar: 'العودة للأعلى'
    }
  };

  /* ── Return + Deep Freeze ── */

  return deepFreeze({
    categories:     categories,
    products:       products,
    certifications: certifications,
    faq:            faq,
    WHATSAPP_NUMBER: WHATSAPP_NUMBER,
    PHONE_NUMBER:    PHONE_NUMBER,
    BRAND_NAME:      BRAND_NAME,
    ADDRESS:         ADDRESS,
    DOMAIN:          DOMAIN,
    SOCIAL_LINKS:    SOCIAL_LINKS,
    META:            META
  });

})();

if (typeof window !== 'undefined') window.COMPANY_DATA = COMPANY_DATA;
