import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'tet',
    label: 'Tết Việt Nam',
    prompts: [
      {
        id: 'tet1',
        label: 'Bé mặc áo dài đỏ bên cành đào',
        description: 'Traditional Vietnamese Tet photography, child wearing a cute red Ao Dai with golden patterns, standing next to a blooming peach blossom tree, soft bokeh background, warm sunlight, happy expression, 8k resolution.'
      },
      {
        id: 'tet2',
        label: 'Bé gói bánh chưng ngày Tết',
        description: 'The child sitting on a bamboo mat wrapping square sticky rice cakes (Banh Chung), surrounded by green Dong leaves, traditional rustic Vietnamese house setting, warm and cozy atmosphere, cinematic lighting.'
      },
      {
        id: 'tet3',
        label: 'Dạo chơi vườn hoa xuân',
        description: 'Wide angle shot of the child walking in a vibrant spring flower garden during Tet festival, wearing traditional yellow Ao Dai, yellow apricot blossoms (Mai flowers), bright sunny day, joyful and energetic.'
      }
    ]
  },
  {
    id: 'christmas',
    label: 'Giáng Sinh',
    prompts: [
      {
        id: 'xmas1',
        label: 'Bé chơi đùa vui vẻ giữa trời tuyết rơi trắng xóa',
        description: 'A magical winter scene, the child wearing a thick red winter coat and wool hat, laughing while playing in the snow, snowflakes falling, soft daylight, winter wonderland background.'
      },
      {
        id: 'xmas2',
        label: 'Bé hóa thân thành chú lùn của ông già Noel',
        description: 'The child dressed as a cute Christmas elf with pointed ears and a green hat, holding a gift box, inside Santa\'s workshop filled with toys, warm candlelight, magical sparkles.'
      },
      {
        id: 'xmas3',
        label: 'Ngủ ngon bên lò sưởi ấm áp',
        description: 'The child wearing cute reindeer pajamas sleeping peacefully on a rug near a fireplace with stockings, Christmas tree lights twinkling in the background, cozy and heartwarming atmosphere.'
      }
    ]
  },
  {
    id: 'cartoon',
    label: 'Hoạt Hình',
    prompts: [
      {
        id: 'toon1',
        label: 'Phong cách 3D Pixar dễ thương',
        description: '3D Disney Pixar style render of the child, big expressive eyes, soft textures, vibrant colors, whimsical background, cute and charming character design, render engine quality.'
      },
      {
        id: 'toon2',
        label: 'Phong cách Anime Nhật Bản',
        description: 'Anime style illustration of the child, Studio Ghibli inspired art style, lush green grassy background, blue sky with fluffy clouds, detailed line work, soft pastel colors.'
      },
       {
        id: 'toon3',
        label: 'Siêu nhân Chibi ngộ nghĩnh',
        description: 'Chibi style character art of the child as a superhero, large head small body proportions, cute and funny pose, colorful comic book background, vector art style.'
      }
    ]
  },
  {
    id: 'mid_autumn',
    label: 'Trung Thu',
    prompts: [
      {
        id: 'ma1',
        label: 'Rước đèn ông sao lung linh',
        description: 'The child holding a glowing traditional red star-shaped lantern, walking in an ancient lantern-filled street at night, full moon in the dark blue sky, magical lighting, festive Mid-Autumn atmosphere.'
      },
      {
        id: 'ma2',
        label: 'Hóa thân Chị Hằng / Chú Cuội cung trăng',
        description: 'Fantasy photography, the child dressed in traditional fairy folklore clothing sitting on a crescent moon among clouds, mystical blue and silver tones, ethereal and dreamy vibe.'
      },
      {
        id: 'ma3',
        label: 'Phá cỗ trông trăng',
        description: 'The child sitting at a traditional bamboo table with mooncakes, tea, and a pomelo puppy, laughing happily, warm yellow lantern light illuminating the face, nostalgic Vietnamese childhood memory.'
      }
    ]
  },
  {
    id: 'fairy',
    label: 'Cổ Tích',
    prompts: [
      {
        id: 'fairy1',
        label: 'Hoàng tử/Công chúa trong lâu đài',
        description: 'The child dressed in royal medieval attire, wearing a small crown, standing on a castle balcony overlooking a fantasy kingdom, golden hour lighting, majestic and regal.'
      },
      {
        id: 'fairy2',
        label: 'Tiên rừng bên suối thần',
        description: 'The child with butterfly wings sitting on a giant mushroom, magical forest setting with glowing plants and fireflies, ethereal atmosphere, dreamy soft focus.'
      },
      {
        id: 'fairy3',
        label: 'Alice ở xứ sở diệu kỳ',
        description: 'The child in a blue dress falling down a rabbit hole with floating clocks and playing cards, surreal fantasy art, vibrant colors, magical swirl effects.'
      }
    ]
  },
  {
    id: 'astronaut',
    label: 'Phi Hành Gia',
    prompts: [
      {
        id: 'astro1',
        label: 'Bé khám phá mặt trăng',
        description: 'The child wearing a detailed white NASA spacesuit, standing on the surface of the moon, Earth visible in the dark starry sky behind, realistic sci-fi photography.'
      },
      {
        id: 'astro2',
        label: 'Lái tàu vũ trụ xuyên ngân hà',
        description: 'The child sitting in the cockpit of a futuristic spaceship, glowing control panels, looking out at a colorful nebula, cinematic lighting, cyber aesthetic.'
      }
    ]
  },
  {
    id: 'picnic',
    label: 'Dã Ngoại',
    prompts: [
      {
        id: 'pic1',
        label: 'Cắm trại phong cách Glamping',
        description: 'The child sitting inside a luxury canvas tent decorated with fairy lights and bohemian rugs, forest background at dusk, warm bonfire glow, cozy and adventurous.'
      },
      {
        id: 'pic2',
        label: 'Picnic mùa thu lãng mạn',
        description: 'The child sitting on a checkered blanket in a park covered with golden autumn leaves, holding an apple, soft sunlight filtering through trees, warm orange and brown tones.'
      },
      {
        id: 'pic3',
        label: 'Khám phá rừng xanh',
        description: 'The child wearing explorer gear with a hat and binoculars, looking at a butterfly in a lush green forest, sunbeams breaking through the canopy, detailed nature photography.'
      }
    ]
  },
  {
    id: 'school',
    label: 'Trường Học',
    prompts: [
      {
        id: 'sch1',
        label: 'Ngày đầu tiên đi học',
        description: 'The child wearing a cute clean uniform and a backpack that is slightly too big, standing at the school gate, bright morning sunlight, hopeful and happy expression.'
      },
      {
        id: 'sch2',
        label: 'Mọt sách đáng yêu trong thư viện',
        description: 'The child wearing round glasses sitting on a pile of books in a classic library, reading intently, magical dust motes in the air, intellectual and cute atmosphere.'
      },
      {
        id: 'sch3',
        label: 'Lễ tốt nghiệp mầm non',
        description: 'The child wearing a miniature graduation gown and cap, holding a rolled diploma with a red ribbon, confetti falling around, blurred celebratory background, proud smile.'
      }
    ]
  },
  {
    id: 'superhero',
    label: 'Siêu Anh Hùng',
    prompts: [
      {
        id: 'sh1',
        label: 'Siêu anh hùng bay lượn bảo vệ thành phố',
        description: 'A cinematic shot of the child as a superhero flying over a futuristic city at sunset, wearing a glowing high-tech cape, heroic pose, detailed armor, dynamic lighting, 8k resolution.'
      },
      {
        id: 'sh2',
        label: 'Bé mặc giáp Iron Man công nghệ cao',
        description: 'Close-up portrait of the child wearing a futuristic red and gold mechanical suit similar to Iron Man, HUD interface reflection in eyes, intricate mechanical details, realistic textures, soft studio lighting.'
      },
      {
        id: 'sh3',
        label: 'Người nhện tí hon đu tơ giữa các tòa nhà',
        description: 'Action shot of the child in a spider-themed superhero suit swinging between skyscrapers, dynamic depth of field, web details, bright daylight, energetic atmosphere.'
      },
      {
        id: 'sh4',
        label: 'Nữ chiến binh Amazon mạnh mẽ',
        description: 'The child as an Amazonian warrior princess, wearing golden armor and a tiara, standing in a lush ancient forest, holding a glowing shield, magical atmosphere, sunbeams filtering through trees.'
      },
      {
        id: 'sh5',
        label: 'Bé sở hữu sức mạnh sấm sét',
        description: 'The child holding a mystical hammer, surrounded by blue lightning effects, wearing nordic armor, stormy sky background, epic fantasy style, highly detailed.'
      }
    ]
  },
  {
    id: 'studio',
    label: 'Studio Cao Cấp',
    prompts: [
      {
        id: 'studio1',
        label: 'Chụp ảnh chân dung nghệ thuật',
        description: 'High-end studio portrait of the child, Rembrandt lighting, black background, elegant formal wear, sharp focus on eyes, professional photography style, 85mm lens.'
      },
      {
        id: 'studio2',
        label: 'Phong cách Vintage cổ điển',
        description: 'Vintage aesthetic photo of the child, sepia tone, wearing 1920s style clothing, film grain texture, nostalgic atmosphere, old camera look.'
      },
      {
        id: 'studio3',
        label: 'Thời trang đường phố cực chất',
        description: 'The child wearing trendy streetwear fashion, hoodies and sneakers, leaning against a graffiti wall, urban city vibes, cool attitude, vibrant colors.'
      }
    ]
  }
];