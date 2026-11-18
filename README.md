# ✏️ Học Vẽ Cùng AI — Phân tích ảnh & dạy vẽ từng bước siêu chi tiết

Trang web dạy vẽ từ một bức ảnh bất kỳ. Người dùng tải ảnh lên, hệ thống **phân tích thật ngay trên trình duyệt** rồi biến ảnh thành một bài học vẽ hoàn chỉnh 13 bước — mỗi bước có hình minh họa được sinh ra từ chính ảnh đó.

**Dùng thử:** mở `index.html` (hoặc bật GitHub Pages cho repo này) → kéo-thả một bức ảnh → học theo lộ trình. Có sẵn nút **“Dùng ảnh mẫu (tĩnh vật)”** để thử ngay mà không cần file.

## Tính năng chính

### 1. AI phân tích ảnh (100% client-side, không máy chủ)
Đo trực tiếp từ pixel của ảnh tải lên bằng Canvas API:

- Kích thước, tỉ lệ khung, hướng ngang/dọc
- Khung bao chủ thể + % diện tích chủ thể chiếm khung (so màu với nền 4 góc)
- Trọng tâm thị giác (centroid của chủ thể) và quan hệ với quy tắc 1/3
- Độ sáng trung bình, tương phản sắc độ, độ bão hòa màu, thiên ấm/lạnh
- Hướng ánh sáng (từ vùng cháy sáng)
- Mật độ đường nét (Sobel edge detection) → độ phức tạp + cảnh báo đơn giản hóa
- Bảng màu chủ đạo 6 màu kèm % diện tích (color quantization)
- Dự đoán loại chủ thể (chân dung / phong cảnh / biển / kiến trúc / tĩnh vật) kèm độ tin cậy
- Sơ đồ bố cục: lưới 1/3 + khung bao + trọng tâm vẽ đè lên ảnh

Ảnh **không rời khỏi máy người dùng** — không upload lên server nào.

### 2. Lộ trình 13 bước — từ đơn giản đến nâng cao
1. Quan sát & đo đạc bằng que đo
2. Phác khung bao & trục chính (envelope)
3. Dựng khối lớn — block-in bằng đường thẳng
4. Chia tỉ lệ & đặt điểm neo (landmarks)
5. Dựng cấu trúc 3D: hộp / trụ / cầu, đường xuyên thấu, cross-contour
6. Kiểm tra âm hình (negative space) & sửa tỉ lệ lần cuối
7. **Tẩy đường dựng bằng tẩy dẻo** — chấm–nhấc, không chà; giữ “bóng ma” ~15%
8. Nét chính thức có trọng lượng (line weight, lost edge)
9. Sắc độ lớn — khóa 3 mảng sáng / trung / tối
10. Đổ bóng đủ 5 thành phần: halftone, terminator, core shadow, reflected light, cast shadow + vẽ bằng tẩy
11. Chi tiết & chất liệu có chọn lọc quanh điểm nhấn
12. Lên màu theo palette đã trích xuất (nhiệt độ ấm/lạnh, kiểm tra lại bằng bản đen trắng)
13. Hoàn thiện: cạnh sắc/mềm/mất, tối đa 5 điểm sáng cuối, 4 phép kiểm tra lật/thu nhỏ, ký tên

Mỗi bước gồm: mục tiêu, dụng cụ, thời gian, thao tác chi tiết từng bước, lỗi thường gặp, checklist tự kiểm tra (tick đủ mới tính hoàn thành), bài tập củng cố.

### 3. Minh họa vẽ từng bước từ chính ảnh của bạn
Mỗi bước có một bản vẽ minh họa riêng được xử lý từ ảnh gốc:

| Bước | Minh họa |
|---|---|
| Quan sát | Lưới 1/3 + đường chéo tầm mắt |
| Khung bao | Ảnh mờ 25% + khung bao đứt nét + trục chính |
| Block-in | Ảnh “khối hóa” pixel-block |
| Điểm neo | Lưới chia tỉ lệ + điểm neo + trọng tâm |
| Cấu trúc 3D | Lượng tử hóa mặt phẳng + khung/elip cấu trúc |
| Âm hình | Silhouette đen/trắng |
| Tẩy đường dựng | Bản đồ nét ở trạng thái “bóng ma” ~15% |
| Nét chính | Line-art trích cạnh (Sobel) |
| Sắc độ | Posterize đúng 3 mức xám |
| Bóng | Sắc độ đầy đủ, tăng chiều sâu vùng tối |
| Chi tiết | Loupe phóng to tại trọng tâm thị giác |
| Màu / Hoàn thiện | Lượng tử hóa màu + palette; bản cuối có vignette |

Kèm: thanh trượt **so sánh với ảnh gốc**, nút **trình chiếu tự động từng bước**, tải hình từng bước dạng PNG.

### 4. Vẽ thật từng nét (stroke-by-stroke replay)
Truy vết đường nét trực tiếp từ ảnh người dùng (Sobel + contour tracing) rồi phát lại quá trình vẽ như một họa sĩ thật: **giai đoạn 1** vẽ nét dựng nhẹ bằng các nét dài nhất, **giai đoạn 2** đi nét chính đậm cho toàn bộ. Có cây bút chạy theo đầu nét, chỉnh tốc độ 0.25×–4×, tua tiến độ tới bất kỳ khoảnh khắc nào, và tải bản nét hoàn chỉnh dạng PNG.

### 5. Phòng luyện tập
Canvas vẽ đè lên hình mẫu mờ của bước đang học, có **bút chì + tẩy thật** (tẩy xóa nét như tẩy dẻo), chỉnh cỡ nét, độ mờ hình mẫu, hoàn tác, xóa hết và tải bài vẽ PNG.

### 5. AI Vision thật (tùy chọn, BYOK — dùng key của chính bạn)
Panel **AI Vision** cho phép nối bất kỳ cổng OpenAI-compatible nào có model vision (OpenAI, Gemini qua endpoint tương thích, Oxion, Intern InkStone, XingChi…). Key chỉ lưu trên trình duyệt của người dùng (localStorage nếu tick ghi nhớ), trang web không có máy chủ và không giữ key.

Khi bấm **Phân tích sâu**, trang gửi bản thu nhỏ của ảnh (≤1024px JPEG) kèm prompt yêu cầu JSON có cấu trúc: loại chủ thể + độ tin cậy, danh sách từng chủ thể với khung bao % (được vẽ đè lên sơ đồ bố cục), bố cục, ánh sáng, phong cách, cảm xúc, chi tiết then chốt, rủi ro dễ vẽ sai, palette và **lời khuyên riêng cho từng bước trong 13 bước** — các lời khuyên này tự xuất hiện trong mục “🤖 AI Vision khuyên riêng cho ảnh này” ở phần Vẽ từng bước.

**API miễn phí (khuyên dùng):** Google Gemini free tier — không cần thẻ, lấy key tại aistudio.google.com/apikey trong ~1 phút, preset Gemini đã là mặc định (model `gemini-2.5-flash`). Dự phòng: OpenRouter với model `:free` (ví dụ `google/gemma-4-31b-it:free`, ~50 lượt/ngày) và Groq free tier. Trong panel có sẵn hướng dẫn lấy key free từng bước.

**Giới hạn đã kiểm chứng (18/11/2026):** XingChi chỉ cho các app lập trình (DeepSeek Harness, Cursor, Cline…) gọi API và chặn trình duyệt/script với lỗi `403 client_not_allowed` — key XingChi của chủ repo hợp lệ (đọc được danh sách model, tài khoản chỉ có `gpt-6.1-sol`) nhưng không dùng được cho vision trên web. Muốn vision trên web, hãy dùng key OpenAI / Gemini / Oxion trong panel.

## Công nghệ
HTML + CSS + JavaScript thuần (không framework, không build). Xử lý ảnh bằng Canvas API: Sobel, lượng tử hóa màu, posterize sắc độ, ước lượng chủ thể theo độ lệch màu nền.

## Cấu trúc
```
index.html   — giao diện
styles.css   — theme studio tối, responsive, có CSS in ấn
app-v8.js    — phân tích ảnh, nội dung 13 bước, render minh họa, phòng luyện tập
```

## Giấy phép
MIT — tự do dùng cho học tập và giảng dạy.
