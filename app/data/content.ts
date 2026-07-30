// 所有網站文字內容都集中在這裡。
// 之後要套用到「另一間寺廟」,只需要改這個檔案的內容,不需要動版型程式碼。

export const content = {
  brand: { vi: "Chùa Kim Cang", zh: "金剛寺" },

  hero: {
    eyebrow: { vi: "CHÙA PHẬT GIÁO VIỆT NAM TẠI ĐÀI LOAN", zh: "越南寺院在台灣" },
    name: { vi: "Chùa Kim Cang", zh: "金剛寺" },
    tagline: {
      vi: "Nơi bình an cho cộng đồng người Việt tại Đài Loan — mở cửa đón tiếp mọi người đến lễ Phật, cầu an và sinh hoạt cộng đồng.",
      zh: "台灣越南人的心靈依靠——歡迎所有人前來禮佛、祈福,參與社群活動。",
    },
    ctaPrimary: { vi: "Xem địa chỉ & giờ mở cửa", zh: "查看地址與開放時間" },
    ctaSecondary: { vi: "Theo dõi Facebook", zh: "追蹤 Facebook" },
    // 背景照片改由後台上傳管理(見 app/lib/imageSlots.ts 的 "hero" 欄位),
    // 沒有上傳照片時會自動顯示原本的漸層底色。
  },

  about: {
    label: { vi: "Giới thiệu", zh: "寺院簡介" },
    title: { vi: "Về Chùa Kim Cang", zh: "關於金剛寺" },
    paragraphs: [
      {
        vi: "Chùa Kim Cang nằm trên đường Trung Sơn Bắc, thành phố Đài Bắc, do Ni sư Chiếu Chân khai sơn sáng lập vào năm 1953 và hoàn thành vào cuối năm đó. Ni sư đã trân trọng thỉnh Pháp sư Đức Tạng chủ trì lễ khai quang điểm nhãn cho các pho tượng Phật. Chùa nằm ở lưng chừng núi Viên Sơn của Đài Bắc; từ trên chùa phóng tầm mắt ra xa có thể thu trọn toàn cảnh thành phố Đài Bắc, phong cảnh hữu tình, du khách viếng thăm quanh năm không ngớt. Ni sư Chiếu Chân, pháp hiệu Phổ Khoan, người thành phố Cơ Long. Ni sư xuống tóc xuất gia tại chùa Kim Cang vào năm 34 tuổi, và đến năm 1961 đã thụ giới Cụ túc tại chùa Lâm Tế ở Đài Bắc, viên thành nguyện lớn từ lâu.",
        zh: "金剛寺位於臺北市中山北路，民國四十二年由照眞尼師開山創建，同年底完成。敦請德藏法師主持佛像開光典禮。該寺地處臺北圓山之腰，登寺遠眺，可俯瞰臺北全市，風景優美，遊客終日不絕。照眞尼師（普寬），基隆市人，三十四歲於金剛寺祝髮出家，民國五十年於臺北臨濟寺受具足戒而償宿願。",
      },
      {
        vi: "Ngày 18 tháng 3 năm 2023 Sư Thầy Thiện Tài được người quản lý Chùa Kim Cang thỉnh cầu về trụ trì chùa này cho đến nay.",
        zh: "從 2023 年 3月 18日起， 金剛寺管理人誠摯邀請緣定法師，擔任金剛寺住持。",
      },
    ],
    facts: [
      { label: { vi: "Thành lập", zh: "創建於" }, value: { vi: "1953", zh: "1953" } },
      { label: { vi: "Tông phái", zh: "宗派" }, value: { vi: "Đạo Phật Đại thừa", zh: "大乘佛教" } },
      { label: { vi: "Ngôn ngữ", zh: "使用語言" }, value: { vi: "Tiếng Việt, Tiếng Trung", zh: "越南語、中文" } },
      { label: { vi: "Trụ trì", zh: "住持" }, value: { vi: "Thích Thiện Tài", zh: "釋緣定法師" } },
    ],
  },

  events: {
    label: { vi: "Lịch pháp hội", zh: "法會行事曆" },
    title: { vi: "Hoạt động sắp tới", zh: "近期活動" },
    intro: {
      vi: "Xem lịch hoạt động cả năm trong hình bên dưới.",
      zh: "全年活動請參考下方行事曆圖片。",
    },
    // 年曆圖片改由後台上傳管理(見 app/lib/imageSlots.ts 的 "calendar" 欄位),
    // 沒有上傳圖片時會自動顯示下面這句提示。
    comingSoon: { vi: "Lịch hoạt động đang được cập nhật", zh: "活動年曆製作中,敬請期待" },
    // 活動輪播:圖片同樣改由後台上傳管理("carousel-1" ~ "carousel-5" 欄位),
    // 這裡只保留每張的顏色佔位跟標題文字;沒上傳照片時會顯示色塊佔位。
    carousel: [
      { color: "bg-maroon", caption: { vi: "Tết Nguyên Đán", zh: "農曆春節" } },
      { color: "bg-gold text-maroon-deep", caption: { vi: "Lễ Phật Đản", zh: "浴佛節" } },
      { color: "bg-jade", caption: { vi: "Lễ Vu Lan Báo Hiếu", zh: "盂蘭盆節" } },
      { color: "bg-maroon", caption: { vi: "Tết Trung Thu", zh: "中秋節" } },
      { color: "bg-gold text-maroon-deep", caption: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
    ],
  },

  gallery: {
    label: { vi: "Hình ảnh", zh: "寺院相簿" },
    title: { vi: "Không gian chùa", zh: "環境空間" },
    // 照片改由後台上傳管理("gallery-1" ~ "gallery-6" 欄位,依照下面的順序對應);
    // 這裡只保留每張沒有照片時的色塊佔位跟標題文字。
    items: [
      { color: "bg-maroon", caption: { vi: "Chánh điện", zh: "大殿" } },
      { color: "bg-jade", caption: { vi: "Sân chùa", zh: "寺院庭院" } },
      { color: "bg-gold text-maroon-deep", caption: { vi: "Lễ Phật Đản", zh: "浴佛節" } },
      { color: "bg-gold text-maroon-deep", caption: { vi: "Bếp chay", zh: "素食廚房" } },
      { color: "bg-jade", caption: { vi: "Tượng Phật", zh: "佛像" } },
      { color: "bg-maroon", caption: { vi: "Sinh hoạt cộng đồng", zh: "社群活動" } },
    ],
  },

  ebooks: {
    label: { vi: "Thư viện", zh: "電子書專區" },
    title: { vi: "Kinh sách điện tử", zh: "電子書專區" },
    intro: {
      vi: "Tải về miễn phí kinh sách dạng PDF và EPUB để tụng đọc mọi lúc, mọi nơi.",
      zh: "免費下載 PDF、EPUB 電子經書,隨時隨地閱讀共修。",
    },
    comingSoon: { vi: "Sắp ra mắt", zh: "即將上線" },
    backHome: { vi: "Về trang chủ", zh: "回首頁" },
  },

  faq: {
    label: { vi: "Câu hỏi thường gặp", zh: "常見問題" },
    title: { vi: "Giải đáp thắc mắc", zh: "參拜前想知道的事" },
    items: [
      {
        q: { vi: "Tôi cần chuẩn bị gì khi đến chùa?", zh: "前來參拜需要準備什麼?" },
        a: {
          vi: "Không cần chuẩn bị gì đặc biệt, chỉ cần ăn mặc lịch sự. Nếu muốn cúng dường, chùa có sẵn hương, hoa.",
          zh: "不需特別準備,只要穿著整齊即可。若想供養,寺內備有香、花。",
        },
      },
      {
        q: { vi: "Chùa có tổ chức lễ cầu siêu không?", zh: "寺院有辦理超薦法會嗎?" },
        a: {
          vi: "Có, xin liên hệ trực tiếp với chùa để đăng ký (thông tin ví dụ).",
          zh: "有的,請直接與寺方聯繫登記(範例說明)。",
        },
      },
    ],
  },

  contact: {
    label: { vi: "Thông tin liên hệ", zh: "參拜資訊" },
    title: { vi: "Đến thăm chùa", zh: "歡迎前來參拜" },
    address: {
      vi: "Số 3, ngõ 2, hẻm 71, đường Zhongshan Bắc (Trung Sơn Bắc), đoạn 4, quận Shilin (Sĩ Lâm), thành phố Đài Bắc, Đài Loan, 10491.",
      zh: "臺北市中山區中山北路四段71巷2弄3號, 10491",
    },
    hours: { vi: "Mở cửa hàng ngày: 08:00 – 20:00", zh: "每日開放時間:08:00–20:00" },
    mapCta: { vi: "Xem trên Google Map", zh: "在 Google 地圖上查看" },
    fbCta: { vi: "Nhắn tin Facebook", zh: "FB 私訊聯絡" },
  },

  footer: {
    vi: "© 2026 Chùa Kim Cang",
    zh: "© 2026 金剛寺",
  },
};
