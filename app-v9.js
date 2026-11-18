"use strict";
/* ============================================================
   Học Vẽ Cùng AI — phân tích ảnh thật bằng Canvas + lộ trình 13 bước
   Mọi số liệu đều đo từ ảnh người dùng tải lên, xử lý 100% client-side.
   ============================================================ */
const $ = s => document.querySelector(s);
const state = { img:null, imgURL:"", analysis:null, step:0, playing:null, done:new Set(), compare:0 };

/* ---------------- LỘ TRÌNH 13 BƯỚC — nội dung siêu chi tiết ---------------- */
const STEPS = [
{ title:"Quan sát & đo đạc — đừng vẽ vội", tagline:"Họa sĩ dành 50% thời gian chỉ để NHÌN. Bước này dạy bạn nhìn như người đo đất.", level:"Nền tảng", time:"15–25 phút", tools:"Ảnh mẫu, que đo/bút chì làm thước, giấy nháp, điện thoại để lật ảnh",
 goal:"Hiểu ảnh trước khi chạm bút: chủ thể là gì, nằm ở đâu, sáng từ đâu, mảng lớn nào quyết định bức tranh.",
 how:["In hoặc mở ảnh ở kích thước bạn sẽ vẽ — vẽ nhỏ hơn ảnh mẫu sẽ làm bạn tham chi tiết sớm.","Nheo mắt lại 70%: thế giới chỉ còn mảng sáng – trung – tối. Ghi ra giấy 3 mảng lớn nhất bạn thấy, đừng ghi chi tiết.","Dùng que đo: giơ thẳng tay, lấy ngón cái chặn chiều cao chủ thể, rồi xoay que đo sang ngang để đếm 'chủ thể cao bằng mấy lần chiều ngang'. Đây là đơn vị đo của riêng bức ảnh này.","Đánh dấu 4 điểm cực trị của chủ thể: cao nhất, thấp nhất, trái nhất, phải nhất. Mọi thứ sau này đều treo vào 4 điểm này.","Xác định đường chân trời / trục chính và hướng sáng: bóng đổ chạy về phía nào thì ánh sáng ở phía ngược lại.","Lật ngang ảnh (mirror): lỗi bố cục và tỉ lệ sẽ lộ ra vì não hết 'quen mặt'."],
 mistakes:["Vẽ ngay chi tiết mình thích nhất (thường là mắt/khuôn mặt) rồi mới phát hiện không còn chỗ cho phần còn lại.","Đo bằng mắt thường mà không dùng que — sai lệch 10–20% là bình thường ở người mới."],
 criteria:["Nói được tỉ lệ cao : ngang của chủ thể bằng đơn vị que đo.","Chỉ đúng hướng sáng và 3 mảng sắc độ lớn nhất.","Đánh dấu đủ 4 điểm cực trị."],
 exercise:"Đo lại toàn bộ bằng que đo lần 2 mà không nhìn lần 1. Hai lần lệch nhau dưới 5% là đạt.",
 caption:"Minh họa: ảnh được phủ lưới 1/3 + các đường chéo tầm mắt. Hãy tập nheo mắt và chỉ nhìn mảng lớn."},

{ title:"Phác khung bao & trục chính (Envelope)", tagline:"Vẽ cái HỘP chứa chủ thể trước khi vẽ chủ thể — như dựng khung nhà trước khi xây tường.", level:"Nền tảng", time:"10 phút", tools:"Bút chì 2B hoặc HB, nét thật nhẹ",
 goal:"Khóa vị trí và kích thước tổng thể của chủ thể lên giấy, đúng tỉ lệ đã đo ở bước 1.",
 how:["Từ 4 điểm cực trị, kẻ 4 đường thẳng mờ tạo thành khung bao (envelope) bao trọn chủ thể. Kẻ bằng CẢ CÁNH TAY, không dùng cổ tay — đường sẽ thẳng và dài.","Bên trong khung, kẻ trục dọc và trục ngang đi qua trọng tâm chủ thể. Hai trục này là 'kinh tuyến gốc' để đối chiếu mọi chi tiết.","Kiểm tra khoảng trống 4 phía: chủ thể cách mép giấy bao nhiêu 'đơn vị que đo' ở mỗi phía? Sai ở đây là sai bố cục toàn bài.","Nếu chủ thể nghiêng, kẻ thêm đường trục nghiêng theo hướng nghiêng đó — đừng ép chủ thể đứng thẳng theo ý bạn.","Lùi ra xa 2 mét nhìn lại: khung bao đã giống 'cái bóng tổng thể' của ảnh mẫu chưa?"],
 mistakes:["Kẻ khung quá đậm — lát nữa tẩy sẽ để lại rãnh trên giấy.","Vẽ khung vừa khít giấy vì 'tiếc giấy': hãy chừa lề ít nhất 2 cm mỗi phía."],
 criteria:["Khung bao đúng tỉ lệ que đo trong sai số 5%.","Trục chính đi qua đúng trọng tâm.","Nét phác mờ tới mức đứng xa 1 mét gần như không thấy."],
 exercise:"Xóa khung đi và phác lại từ đầu trong 3 phút. Lần 2 phải nhanh và đúng hơn lần 1.",
 caption:"Minh họa: ảnh gốc làm mờ còn 25%, khung đỏ đứt nét = khung bao chủ thể AI đo được, hai trục vàng = trục chính."},

{ title:"Dựng khối lớn — Block-in bằng đường thẳng", tagline:"Biến mọi đường cong thành chuỗi đoạn thẳng. Khối đúng trước, cong tính sau.", level:"Cơ bản", time:"20–30 phút", tools:"Bút chì 2B, nét nhẹ, thước chỉ để kiểm tra (không dùng để kẻ)",
 goal:"Dựng hình dáng tổng thể của chủ thể bằng 8–15 đoạn thẳng lớn, bắt đúng các góc nghiêng quyết định.",
 how:["Đi vòng quanh chu vi chủ thể, mỗi lần đổi hướng rõ rệt là một đoạn thẳng. Đừng vẽ đường cong ở bước này — cong là tổng của nhiều thẳng ngắn.","Mỗi đoạn thẳng phải kiểm tra 2 thứ: GÓC NGHIÊNG (so với trục ngang/dọc) và ĐỘ DÀI (bằng que đo). Góc sai 5 độ là hình đã 'trôi'.","Nối các đoạn thành một đa giác khép kín bao trọn chủ thể. Đây gọi là block-in — hình khối thô của bạn.","Đo lại 3 cặp tỉ lệ quan trọng nhất (ví dụ: đầu/thân, rộng vai/rộng hông, phần sáng/phần tối) và sửa ngay trên đa giác.","Tuyệt đối chưa vẽ chi tiết bên trong: không mắt, không lá, không vân — chỉ có hình bao ngoài."],
 mistakes:["Vẽ cong mềm ngay từ đầu → mất kiểm soát góc, hình 'nhão' không bắt được dáng.","Thêm chi tiết sớm vì 'thấy rõ quá' — chi tiết sẽ phải vẽ lại hết khi sửa khối."],
 criteria:["Đa giác block-in chồng lên ảnh mẫu (giơ lên ánh sáng soi) khớp trên 90%.","Đếm được số đoạn thẳng và nói được góc nghiêng của 3 đoạn chính."],
 exercise:"Vẽ lại block-in của cùng ảnh trong 5 phút, không nhìn bản cũ. So hai bản chồng nhau.",
 caption:"Minh họa: ảnh được 'khối hóa' thành các ô vuông lớn (pixel-block) — cách AI mô phỏng việc mắt bạn phải gộp chi tiết thành mảng khối."},

{ title:"Chia tỉ lệ & đặt điểm neo (Landmarks)", tagline:"Chia khối thành các ô tỉ lệ và ghim những điểm không được phép sai.", level:"Cơ bản", time:"15 phút", tools:"Que đo, bút chì HB, tẩy đầu nhỏ",
 goal:"Chia khung bao theo tỉ lệ thật và đánh dấu các điểm neo — những điểm mà mọi chi tiết sẽ móc vào.",
 how:["Chia chiều cao khung bao thành các phần bằng que đo theo đúng ảnh (ví dụ chân dung: đỉnh đầu → chân mày → chân mũi → cằm theo tỉ lệ riêng của mẫu, KHÔNG theo công thức sách giáo khoa nếu mẫu khác).","Tại mỗi mốc chia, kẻ một đường ngang mờ xuyên qua toàn khối.","Đánh dấu điểm neo: hai điểm rộng nhất, điểm hẹp nhất, điểm giao của các trục, điểm bắt đầu của bóng đổ lớn.","Nối các điểm neo bằng đường thẳng phụ — bạn đang dựng 'giàn giáo' bên trong khối.","Đo đường chéo hai chiều: hai đường chéo của khung bao phải cắt nhau tại trọng tâm đã đánh dấu ở bước 2."],
 mistakes:["Áp công thức tỉ lệ 'chuẩn' (đầu = 1/8 người…) lên một mẫu có tỉ lệ khác — mẫu luôn đúng, công thức chỉ để tham khảo.","Đánh dấu điểm neo bằng chấm đậm; chỉ cần dấu cộng (+) thật mờ."],
 criteria:["Mọi mốc chia đều có số đo que đo ghi kèm ở lề giấy.","Ít nhất 6 điểm neo được đánh dấu và kiểm chứng hai lần."],
 exercise:"Che ảnh mẫu, chỉ nhìn giàn giáo điểm neo và thử kể lại chủ thể trông thế nào. Kể được là giàn giáo đã đúng.",
 caption:"Minh họa: lưới 1/3 + các điểm neo tại góc khung bao, trọng tâm và tâm thị giác mà AI đo được từ ảnh của bạn."},

{ title:"Dựng cấu trúc 3D — khối hộp, trụ, cầu bên trong", tagline:"Mọi vật đều là hộp, trụ, cầu hoặc nón đội lốt. Vẽ được khối bên trong thì ánh sáng mới có chỗ bám.", level:"Trung cấp", time:"25 phút", tools:"Bút chì 2B, nét nhẹ, có thể dùng màu chì khác cho đường cấu trúc",
 goal:"Hiểu thể tích của chủ thể: phần nào là mặt phẳng hướng lên, phần nào quay sang ngang, phần nào đang khuất.",
 how:["Với từng bộ phận lớn, hỏi: nó gần với khối nào nhất — hộp (kiến trúc, sách), trụ (tay, thân cây, cổ), cầu (đầu, quả), nón (mái nhà, váy)?","Vẽ khối cơ bản đó vào đúng vị trí, kể cả phần bị che khuất — vẽ 'xuyên thấu' như chụp X-quang. Đường xuyên thấu sẽ tẩy đi sau, nhưng nó giữ cho thể tích không bị xẹp.","Kẻ các đường vòng (cross-contour) ôm quanh khối trụ/cầu: đường vòng cong đúng hướng sẽ lập tức tạo cảm giác 3D.","Đánh dấu mặt hướng sáng và mặt khuất bằng ký hiệu + / − nhỏ ở lề từng khối.","Kiểm tra điểm tụ nếu có kiến trúc/đường thẳng dài: mọi cạnh song song trong thực tế phải hội tụ về cùng một điểm trên đường chân trời."],
 mistakes:["Vẽ bề mặt như dán giấy phẳng — không có đường xuyên thấu nên vật trông như cắt dán.","Quên phần khuất: hai bộ phận chồng nhau mà không rõ cái nào trước, cái nào sau."],
 criteria:["Mỗi bộ phận lớn gọi được tên khối cơ bản của nó.","Có ít nhất 3 đường vòng cross-contour đúng hướng cong.","Phân biệt rõ mặt sáng / mặt khuất trên từng khối."],
 exercise:"Vẽ riêng 1 khối hộp, 1 trụ, 1 cầu dưới cùng hướng sáng của ảnh mẫu, tô 3 sắc độ cho mỗi khối.",
 caption:"Minh họa: ảnh được lượng tử hóa còn ít mức xám để lộ các mặt phẳng lớn — kèm khung cấu trúc và elip bao mà bạn cần dựng bên trong."},

{ title:"Kiểm tra âm hình & sửa tỉ lệ lần cuối", tagline:"Vẽ khoảng TRỐNG quanh chủ thể đôi khi chính xác hơn vẽ chính chủ thể.", level:"Trung cấp", time:"15 phút", tools:"Mắt nheo, gương hoặc điện thoại chụp lại bài vẽ",
 goal:"Dùng hình âm (negative space) và các phép lật/gương để bắt mọi lỗi tỉ lệ còn sót trước khi sang nét chính thức.",
 how:["Liệt kê 3–4 khoảng trống lớn quanh chủ thể (góc giấy, khe giữa hai bộ phận…). Vẽ hình dạng của chính những khoảng trống đó như thể chúng là 'vật thể'.","So từng âm hình với ảnh mẫu bằng que đo: âm hình sai nghĩa là dương hình (chủ thể) cũng sai ở đúng chỗ đó.","Chụp bài vẽ bằng điện thoại, lật ngang và thu nhỏ: lỗi tỉ lệ sẽ đập vào mắt trong 3 giây đầu.","Đo lại lần cuối 3 tỉ lệ quan trọng nhất. Đây là lần sửa cuối cùng được phép sửa lớn — sau bước này chỉ sửa nhỏ.","Ghi ra lề 3 lỗi vừa sửa. Danh sách lỗi của chính bạn là giáo trình quý nhất cho bức sau."],
 mistakes:["Chỉ nhìn chủ thể mà không nhìn khoảng trống — não tự 'điền' phần quen thuộc và bỏ qua lỗi.","Sửa miệng bằng cảm giác thay vì đo lại: mọi lần sửa đều phải có số đo đi kèm."],
 criteria:["Vẽ được ít nhất 3 âm hình khớp mẫu.","Bài vẽ khi lật ngang vẫn 'đứng vững' không thấy điểm nào vô lý.","Không còn lỗi tỉ lệ nào lớn hơn 5%."],
 exercise:"Tô đen toàn bộ âm hình trên một bản photocopy/ảnh chụp bài vẽ — chủ thể trắng nổi lên phải giống mẫu ngay lập tức.",
 caption:"Minh họa: hình bóng (silhouette) chủ thể đen trên nền trắng — khi chỉ còn âm/dương hình, mọi lỗi tỉ lệ đều không giấu được."},

{ title:"TẨY ĐƯỜNG DỰNG — bước bị bỏ quên nhiều nhất", tagline:"Dựng xong không phải để giữ lại. Tẩy đúng cách biến bản phác thô thành nền sạch cho nét thật.", level:"Trung cấp · QUAN TRỌNG", time:"10–15 phút", tools:"Tẩy dẻo (kneaded eraser) là chính, tẩy thường chỉ cho lỗi đậm, chổi mềm phủi vụn tẩy",
 goal:"Nhấc bỏ 80–90% đường dựng (khung bao, trục, giàn giáo, đường xuyên thấu) nhưng vẫn giữ lại 'bóng ma' đủ mờ để vẽ nét chính không lạc đường.",
 how:["Vo tẩy dẻo thành đầu tù, CHẤM – NHẤC thẳng lên (dab & lift), tuyệt đối không chà ngang: chà sẽ đẩy than chì sâu vào thớ giấy và làm đường dựng đậm thêm.","Đi theo thứ tự: tẩy khung bao ngoài cùng trước, rồi trục chính, rồi đường xuyên thấu bên trong. Mỗi đường chấm 2–3 lần cho tới khi chỉ còn mờ khoảng 10–15% như hình minh họa bước này.","Riêng block-in chu vi: chỉ tẩy NHẸ một nửa độ đậm. Đây là đường bạn sẽ vẽ nét chính đè lên, tẩy sạch hẳn sẽ mất mốc.","Tẩy xong, phủi vụn bằng chổi mềm hoặc thổi — không dùng tay quệt (dầu tay làm bẩn giấy và khiến nét sau ăn không đều).","Nghiêng giấy dưới ánh sáng xiên: nếu còn thấy 'rãnh' do lúc dựng ấn quá mạnh, dùng tẩy dẻo chấm thêm và từ bước sau hãy vẽ nhẹ tay hơn.","Kiểm tra: lùi xa 1 mét — bạn chỉ nên thấy hình dáng chủ thể như một 'bóng ma' mờ, không còn đường nào đủ đậm để tranh chấp với nét chính sắp vẽ."],
 mistakes:["Chà tẩy qua lại → giấy xù, than lan thành vệt xám bẩn không cứu được.","Tẩy sạch 100% cho 'đẹp' → mất hết mốc, nét chính vẽ lại từ đầu và sai từ đầu.","Dùng tẩy rẻ cứng làm rách mặt giấy; với giấy vẽ hãy đầu tư tẩy dẻo — nó nhấc than lên thay vì mài giấy."],
 criteria:["Đường dựng còn khoảng 10–15% độ đậm, đủ thấy khi nhìn gần, biến mất khi nhìn xa 1 mét.","Giấy không xù, không vệt xám, không rãnh hằn.","Chu vi block-in vẫn đọc được để bám theo."],
 exercise:"Trên giấy nháp, vẽ 5 đường từ đậm tới nhạt rồi tập tẩy dẻo cho cả 5 đường cùng về đúng mức mờ 15%. Đây là bài tập 'cơ bắp' của bước này.",
 caption:"Minh họa: bản đồ đường nét của ảnh ở trạng thái 'bóng ma' mờ ~15% — đúng trạng thái tờ giấy của bạn phải đạt sau khi tẩy đường dựng."},

{ title:"Nét chính thức — Line work có trọng lượng", tagline:"Giờ mới được vẽ đường thật: mỗi nét một lần dứt khoát, đậm nhạt có chủ đích.", level:"Trung cấp", time:"20 phút", tools:"Bút chì 2B–4B hoặc bút line, tay đã 'nóng' sau khi luyện nét trên giấy nháp",
 goal:"Vẽ lại chu vi và các đường cấu trúc quan trọng đè lên bóng ma đường dựng, với độ đậm có phân cấp.",
 how:["Luyện tay 2 phút trên giấy nháp: kẻ 10 đường thẳng dài bằng cả cánh tay, 10 đường cong lớn. Tay run ở giấy nháp còn hơn run trên bài.","Vẽ các đường DÀI trước, đường ngắn sau. Một đường cong dài vẽ liền một hơi sẽ sống hơn 5 đoạn nối vụn.","Phân cấp nét (line weight): nét ở phía khuất sáng và nét bị che → đậm và dày; nét hứng sáng, nét ở xa → nhạt và mảnh, có chỗ cố tình 'mất nét' (lost edge).","Đường giao nhau giữa hai vật thể luôn đậm hơn đường chạy một mình — mắt đọc đó là 'tiếp xúc'.","Sai thì đừng tẩy ngay giữa chừng: vẽ đường đúng bên cạnh, xong đoạn mới quay lại tẩy đường sai bằng tẩy dẻo đầu nhọn.","Giữ lại 2–3 chỗ mất nét có chủ đích ở vùng sáng nhất — đó là nơi ánh sáng 'ăn' mất đường viền, rất điện ảnh."],
 mistakes:["Nét 'lông' — đi đi lại lại nhiều lần ngắn vụn vì thiếu tự tin. Thuốc chữa: vẽ chậm nhưng LIỀN, chấp nhận sai rồi tẩy.","Mọi nét đậm như nhau → tranh phẳng như bản đồ, mất hết sáng/tối."],
 criteria:["Đọc được ít nhất 3 cấp độ đậm nhạt của nét.","Có lost edge ở vùng sáng.","Không còn nét lông ở các đường chính."],
 exercise:"Vẽ lại đúng chu vi chủ thể chỉ bằng 12 nét liền. Đếm nét thành tiếng khi vẽ.",
 caption:"Minh họa: bản line-art sạch trích từ ảnh của bạn — đích đến của bước này: nét liền, có đậm nhạt, có chỗ mất nét."},

{ title:"Sắc độ lớn — khóa 3 mảng sáng / trung / tối", tagline:"Chưa cần đẹp, chỉ cần ĐÚNG MẢNG. Sắc độ đúng thì tranh tự nhiên có ánh sáng.", level:"Nâng cao", time:"25 phút", tools:"Bút chì 4B–6B cho mảng tối, HB cho mảng trung, giấy ăn/bông để chà nhẹ nếu cần",
 goal:"Phủ toàn bài bằng đúng 3 giá trị sắc độ lớn theo đúng vị trí đã nheo mắt thấy ở bước 1.",
 how:["Nheo mắt, xác định lại mảng TỐI lớn nhất và tô nó trước bằng nét chéo (hatching) đều tay, chừa mảng sáng nhất hoàn toàn trắng giấy.","Mảng TRUNG: tô bằng HB với lực tay bằng một nửa, hoặc để chính là lớp chì nhạt của bước trước.","Ranh giới mảng tối/trung phải theo đúng hình bóng đổ trong mẫu — vẽ hình của BÓNG như một 'nhân vật' riêng, đừng tô theo vật thể.","Giữ quy tắc: không mảng nào trong vùng sáng được tối bằng mảng tối nhất của vùng khuất, và ngược lại. Đây là 'luật không vượt rào' của sắc độ.","Lùi xa 2 mét + thu nhỏ ảnh chụp bài vẽ: 3 mảng phải đọc rõ ngay cả khi tranh nhỏ bằng bao diêm."],
 mistakes:["Tô đều tay khắp nơi vì sợ đậm → tranh xám xịt, không có điểm nhấn. Đậm nhất phải thật đậm, sáng nhất phải trắng giấy.","Tô chi tiết nhỏ trong lúc đang làm mảng lớn — lại là bệnh nhảy bước."],
 criteria:["Thu nhỏ bài vẽ vẫn đọc được đúng 3 mảng như mẫu.","Vùng sáng nhất còn trắng giấy ít nhất 10% diện tích.","Hình bóng đổ đúng hình dạng trong ảnh mẫu."],
 exercise:"Vẽ lại toàn bài chỉ trong 10 phút và chỉ 3 sắc độ, khổ nhỏ bằng bàn tay. Tốc độ ép bạn bỏ chi tiết.",
 caption:"Minh họa: ảnh của bạn được rút còn đúng 3 mức xám — bản đồ sắc độ bạn phải đạt ở cuối bước này."},

{ title:"Đổ bóng & mô hình ánh sáng", tagline:"Bóng có 5 thành phần và họa sĩ giỏi vẽ đủ cả 5. Thiếu một, vật sẽ 'bay' khỏi mặt đất.", level:"Nâng cao", time:"30 phút", tools:"Chì 2B–8B đủ thang, tẩy dẻo vê nhọn để 'vẽ bằng tẩy', giấy chà (stump) dùng tiết chế",
 goal:"Hoàn thiện hệ thống sáng – tối: vùng sáng, bán sáng (halftone), đường terminator, lõi tối, ánh phản quang và bóng đổ xuống mặt đất.",
 how:["Xác định TERMINATOR — đường biên nơi mặt vật quay lưng hẳn với ánh sáng. Ngay sát terminator là LÕI TỐI (core shadow), phần tối nhất trên chính vật thể.","Bên trong vùng tối vẫn có ÁNH PHẢN QUANG (reflected light) từ mặt đất/môi trường hắt lên: nó sáng hơn lõi tối một chút nhưng TUYỆT ĐỐI không sáng bằng halftone phía sáng — vượt rào này là lỗi kinh điển.","BÓNG ĐỔ (cast shadow): sát vật thì sắc nét và đậm, càng xa vật càng mờ và nhạt. Kẻ bóng đổ theo đúng hướng đã xác định ở bước 1.","Vùng SÁNG nhất (highlight) trên vật bóng là điểm nhỏ gần như trắng giấy — để dành, đừng tô, và nếu cần hãy 'khoét' lại bằng tẩy dẻo vê nhọn ở cuối.","Dùng stump chà CHỈ ở các chuyển sắc độ mềm (má, vải); bề mặt cứng (gỗ, kim loại, kiến trúc) giữ nét hatching sắc để chất liệu không bị 'nhão'.","Vẽ bằng tẩy: trong vùng tối lớn, dùng tẩy nhọn nhấc ra các chi tiết sáng nhỏ (sợi tóc sáng, cạnh vật bắt sáng) — đây là kỹ thuật nâng cao tạo chiều sâu cực mạnh."],
 mistakes:["Tô bóng đổ đen sì một màu từ đầu tới cuối → vật như dán trên nền đen.","Ánh phản quang sáng quá tay → vùng tối bị 'thủng', mắt đọc thành nguồn sáng thứ hai."],
 criteria:["Gọi tên và chỉ được đủ 5 thành phần sáng trên bài vẽ.","Bóng đổ có đầu sắc – đuôi mờ rõ ràng.","Highlight vẫn trắng giấy, chưa bị tô lấp."],
 exercise:"Vẽ một quả cầu trắng dưới đúng hướng sáng của ảnh mẫu, đủ 5 thành phần, trong 15 phút.",
 caption:"Minh họa: bản sắc độ đầy đủ của ảnh bạn với tương phản được đẩy lên — hãy tìm đủ 5 thành phần bóng trên đó."},

{ title:"Chi tiết & chất liệu — vẽ có chọn lọc", tagline:"Chi tiết không rải đều: dày ở điểm nhấn, thưa dần ra xa. Đó là cách mắt người thật nhìn thế giới.", level:"Nâng cao", time:"30–45 phút", tools:"Chì HB–2B đầu nhọn, tẩy đầu nhỏ, bút gel trắng (nếu vẽ trên giấy trắng thì dùng tẩy thay thế)",
 goal:"Thêm chi tiết và chất liệu đúng chỗ: sắc nét ở tiêu điểm, mềm dần về rìa, mỗi chất liệu một 'ngữ pháp' nét riêng.",
 how:["Chọn 1 ĐIỂM NHẤN duy nhất (thường là nơi tương phản cao nhất gần trọng tâm). Chi tiết ở đây vẽ đủ 100%.","Xa điểm nhấn, mức chi tiết giảm theo vòng tròn: 70% → 40% → chỉ còn mảng. Vùng rìa tranh cố tình để 'thở'.","Chất liệu quyết định nét: da dùng chuyển sắc độ mềm không nét cứng; tóc vẽ theo CHÙM và hướng chảy, không vẽ từng sợi trừ vài sợi ở điểm nhấn; vải theo nếp gấp lớn; gỗ/kim loại cần cạnh sắc và highlight hẹp.","Mắt (nếu là chân dung) vẽ SAU CÙNG trong nhóm chi tiết và là nơi duy nhất được phép có nét đen nhất + trắng nhất của toàn bài.","Liên tục đối chiếu: cứ 5 phút lại nheo mắt nhìn tổng thể một lần. Chi tiết nào làm vỡ mảng lớn thì chi tiết đó sai, dù nó 'đúng mẫu' đến đâu."],
 mistakes:["Vẽ chi tiết đều khắp như ảnh chụp → tranh ngộp, không có điểm nhìn.","Vẽ từng sợi tóc/từng chiếc lá: mắt người không thấy thế, tranh sẽ rối và 'rẻ'."],
 criteria:["Chỉ ra được điểm nhấn và giải thích vì sao chi tiết dày nhất ở đó.","Ít nhất 2 chất liệu được phân biệt rõ bằng nét.","Nheo mắt vẫn thấy mảng lớn nguyên vẹn."],
 exercise:"Chọn một ô vuông 5×5 cm ở điểm nhấn và vẽ nó ở khổ gấp đôi, đầy đủ chi tiết, trong 15 phút.",
 caption:"Minh họa: ảnh gốc ở độ nét đầy đủ với vòng loupe tại trọng tâm thị giác — vùng chi tiết 100% của bạn nên nằm đúng ở đó."},

{ title:"Lên màu — từ bản sắc độ thành bản màu", tagline:"Màu đứng trên vai sắc độ: sắc độ sai thì màu đẹp cũng sụp. (Bỏ qua nếu bạn vẽ chì đơn sắc — khi đó bước này là bước cân chỉnh sắc độ cuối).", level:"Nâng cao", time:"30–45 phút", tools:"Màu chì / màu nước / digital tùy bạn — bảng màu đã trích từ ảnh ở phần phân tích là gợi ý pha màu",
 goal:"Phủ màu theo đúng bản đồ sắc độ đã khóa: màu sáng vẫn sáng, màu tối vẫn tối, và nhiệt độ màu kể câu chuyện ánh sáng.",
 how:["Bắt đầu bằng các mảng màu LỚN nhất, dùng đúng bảng màu AI đã trích từ ảnh của bạn (xem phần Phân tích): đó là 6 màu chiếm diện tích lớn nhất, pha sẵn ra khay trước khi vẽ.","Phủ màu theo lớp mỏng (glazing/layering): 3 lớp mỏng luôn trong và sâu hơn 1 lớp dày đặc.","Nhiệt độ: vùng hứng sáng thường ẤM hơn (vàng/cam), vùng bóng thường LẠNH hơn (xanh/tím) vì bóng ăn ánh sáng môi trường. Đẩy nhẹ quy luật này lên sẽ thấy tranh 'có nắng' ngay.","Màu bão hòa nhất chỉ đặt ở điểm nhấn. Màu ở xa và ở bóng phải giảm bão hòa (pha thêm màu bổ túc hoặc xám).","Kiểm tra bằng cách chụp ảnh bài vẽ và chuyển sang đen trắng: nếu bản đen trắng vẫn đúng hệt bước 9–10 thì màu của bạn đang đứng đúng trên sắc độ. Sai thì sửa sắc độ, đừng sửa màu."],
 mistakes:["Chọn màu theo 'màu thật của vật' trong đầu (lá phải xanh tươi, da phải hồng) thay vì màu mắt thấy dưới ánh sáng đó.","Lên màu trước khi sắc độ khóa xong — màu sẽ che lỗi sắc độ được vài phút rồi lộ hết."],
 criteria:["Ảnh đen trắng của bài vẽ khớp bản đồ sắc độ bước 9–10.","Đọc được vùng ấm / vùng lạnh rõ ràng.","Màu bão hòa nhất nằm tại điểm nhấn."],
 exercise:"Pha lại 6 màu trong bảng màu trích xuất chỉ bằng 3 màu cơ bản + trắng + đen. Pha trúng 5/6 màu là đạt.",
 caption:"Minh họa: ảnh của bạn được lượng tử hóa màu theo bảng màu chủ đạo + dải palette ở chân hình — bản đồ lên màu của bước này."},

{ title:"Hoàn thiện — cạnh, điểm sáng cuối & chữ ký", tagline:"Bước cuối không thêm gì nhiều: nó QUYẾT ĐỊNH chỗ nào sắc, chỗ nào mờ, và khi nào thì dừng.", level:"Hoàn thiện", time:"20 phút", tools:"Tẩy dẻo vê nhọn, bút gel trắng/chì trắng, gương, điện thoại",
 goal:"Tinh chỉnh cạnh (edges), đặt vài điểm sáng cuối cùng, kiểm tra tổng thể bằng mọi phép lật và ký tên như một tác phẩm hoàn chỉnh.",
 how:["Đi một vòng quanh tranh phân loại CẠNH: cạnh SẮC (hai vật chồng nhau, điểm nhấn), cạnh MỀM (chuyển khối tròn), cạnh MẤT (vùng sáng nuốt viền). Làm sắc thêm cạnh cần sắc bằng nét đậm mảnh; làm mềm cạnh cần mềm bằng cách chà nhẹ hoặc tẩy nhấc.","Đặt tối đa 3–5 ĐIỂM SÁNG cuối (catchlight trong mắt, giọt nước, cạnh kim loại) bằng tẩy nhọn hoặc gel trắng. Ít thôi — điểm sáng rẻ nhất khi nó hiếm.","Kiểm tra 4 phép: lật ngang, lật dọc (lộn ngược), thu nhỏ bằng bao diêm, nhìn qua gương. Mỗi phép cho não một 'đôi mắt mới'.","So với ảnh mẫu lần cuối ở cấp độ MẢNG, không phải chi tiết: giống 85% ở mảng lớn là một bài vẽ thành công.","Dừng đúng lúc: hai lần sửa liên tiếp mà tranh không tốt lên rõ rệt nghĩa là đã tới điểm dừng. Ký tên nhỏ ở góc, ghi ngày — và chụp lại lưu hành trình 13 bước của bạn."],
 mistakes:["'Nâng cấp' vô hạn làm tranh chết nét (overwork) — giấy có giới hạn chịu đựng, qua ngưỡng là xù và bẩn.","Thêm điểm sáng khắp nơi → không còn điểm sáng nào đặc biệt."],
 criteria:["Phân loại và xử lý được đủ 3 loại cạnh.","Không quá 5 điểm sáng cuối, đều có lý do.","Qua được cả 4 phép kiểm tra lật/thu nhỏ."],
 exercise:"Chụp bài vẽ, in nhỏ bằng bao diêm và dán cạnh ảnh mẫu cũng in cùng cỡ. Đứng xa 3 mét so hai bản trong 1 phút và ghi 3 điểm khác biệt lớn nhất còn lại.",
 caption:"Minh họa: tác phẩm hoàn thiện — ảnh gốc với viền sáng nhẹ (vignette) tập trung mắt vào chủ thể, như cách bạn sẽ đóng khung bài vẽ của mình."}
];

/* ---------------- XỬ LÝ ẢNH ---------------- */
function makeCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c;}
function fitSize(w,h,max){const s=Math.min(1,max/Math.max(w,h));return[Math.max(2,Math.round(w*s)),Math.max(2,Math.round(h*s))];}
function getPixels(img,max=240){const [w,h]=fitSize(img.naturalWidth||img.width,img.naturalHeight||img.height,max);const c=makeCanvas(w,h),x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0,w,h);return{data:x.getImageData(0,0,w,h),w,h,ctx:x,canvas:c};}
const lum=(r,g,b)=>0.2126*r+0.7152*g+0.0722*b;
function hex(r,g,b){return "#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("").toUpperCase();}

function labelComponents(mask,w,h){
  const seen=new Uint8Array(w*h), comps=[], stack=[];
  for(let s=0;s<w*h;s++){
    if(!mask[s]||seen[s]) continue;
    let area=0,minX=w,minY=h,maxX=0,maxY=0,sx=0,sy=0; stack.length=0; stack.push(s); seen[s]=1;
    while(stack.length){ const cur=stack.pop(); area++; const cx=cur%w, cy=(cur/w)|0;
      if(cx<minX)minX=cx; if(cx>maxX)maxX=cx; if(cy<minY)minY=cy; if(cy>maxY)maxY=cy; sx+=cx; sy+=cy;
      if(cx>0&&mask[cur-1]&&!seen[cur-1]){seen[cur-1]=1;stack.push(cur-1);}
      if(cx<w-1&&mask[cur+1]&&!seen[cur+1]){seen[cur+1]=1;stack.push(cur+1);}
      if(cy>0&&mask[cur-w]&&!seen[cur-w]){seen[cur-w]=1;stack.push(cur-w);}
      if(cy<h-1&&mask[cur+w]&&!seen[cur+w]){seen[cur+w]=1;stack.push(cur+w);} }
    const bw=maxX-minX+1, bh=maxY-minY+1, fill=area/(bw*bh), aspect=bw/bh;
    if(area<w*h*0.004||area>w*h*0.92) continue;
    const kind = aspect<0.68 ? "cylinder" : (fill>=0.86 ? "box" : "ellipse");
    comps.push({x:minX/w,y:minY/h,w:bw/w,h:bh/h,cx:sx/area/w,cy:sy/area/h,fill,aspect,kind,area});
  }
  comps.sort((a,b)=>b.area-a.area);
  return comps.slice(0,6);
}
function analyze(img){
  const {data,w,h}=getPixels(img,240), d=data.data, n=w*h;
  let sumL=0,sumS=0,sumR=0,sumB=0, gray=new Float32Array(n);
  const buckets=new Map();
  for(let i=0,p=0;i<d.length;i+=4,p++){
    const r=d[i],g=d[i+1],b=d[i+2], L=lum(r,g,b); gray[p]=L; sumL+=L; sumR+=r; sumB+=b;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b); sumS+= mx? (mx-mn)/mx:0;
    const key=((r>>5)<<6)|((g>>5)<<3)|(b>>5);
    const bk=buckets.get(key)||{count:0,r:0,g:0,b:0}; bk.count++; bk.r+=r; bk.g+=g; bk.b+=b; buckets.set(key,bk);
  }
  const mean=sumL/n; let varL=0; for(let p=0;p<n;p++) varL+=(gray[p]-mean)**2; const contrast=Math.sqrt(varL/n);
  // Sobel edge density + light centroid
  let edgeCount=0, brightX=0,brightY=0,brightN=0;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;
    const gx=-gray[p-w-1]-2*gray[p-1]-gray[p+w-1]+gray[p-w+1]+2*gray[p+1]+gray[p+w+1];
    const gy=-gray[p-w-1]-2*gray[p-w]-gray[p-w+1]+gray[p+w-1]+2*gray[p+w]+gray[p+w+1];
    if(Math.hypot(gx,gy)>110) edgeCount++;
    if(gray[p]>215){brightX+=x;brightY+=y;brightN++;}
  }
  const edgeDensity=edgeCount/n;
  // Background = average of 4 corner patches
  function corner(cx,cy){let r=0,g=0,b=0,c=0;for(let y=Math.max(0,cy-6);y<Math.min(h,cy+6);y++)for(let x=Math.max(0,cx-6);x<Math.min(w,cx+6);x++){const i=(y*w+x)*4;r+=d[i];g+=d[i+1];b+=d[i+2];c++;}return[r/c,g/c,b/c];}
  const cs=[corner(0,0),corner(w-1,0),corner(0,h-1),corner(w-1,h-1)];
  const bg=[0,1,2].map(k=>(cs[0][k]+cs[1][k]+cs[2][k]+cs[3][k])/4);
  // Subject bbox from colour distance to background
  let minX=w,minY=h,maxX=0,maxY=0,sx=0,sy=0,sn=0;
  const subjMask=new Uint8Array(n);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;
    // Pixel is background if it is close to ANY of the 4 corner colours —
    // this handles gradient skies and multi-colour backgrounds correctly.
    let dist=1e9; for(const cc of cs){const dd=Math.hypot(d[i]-cc[0],d[i+1]-cc[1],d[i+2]-cc[2]); if(dd<dist)dist=dd;}
    if(dist>52){subjMask[y*w+x]=1;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;sx+=x;sy+=y;sn++;}
  }
  if(sn<n*0.02){minX=w*0.15;minY=h*0.12;maxX=w*0.85;maxY=h*0.88;sx=w/2*n*0.5;sy=h/2*n*0.5;sn=n*0.5;}
  const palette=[...buckets.values()].sort((a,b)=>b.count-a.count).slice(0,6)
    .map(bk=>({hex:hex(bk.r/bk.count,bk.g/bk.count,bk.b/bk.count),pct:Math.round(bk.count/n*100)}));
  // Hue family counts for a subject guess
  let green=0,blue=0,skin=0,warm=0,blueTop=0;
  for(let p=0,i=0;i<d.length;i+=4,p++){const r=d[i],g=d[i+1],b=d[i+2];
    if(g>r&&g>b&&g>60)green++; if(b>r&&b>g&&b>60){blue++; if((p/w)<h*0.42)blueTop++;}
    if(r>120&&g>70&&g<170&&b<g&&r>g*1.15&&r>b*1.4)skin++;
    if(r>g&&g>b&&r>100)warm++;}
  let guess="Vật thể / cảnh (chưa rõ loại)", conf=50;
  if(skin/n>0.11){guess="Chân dung / con người";conf=Math.min(88,55+Math.round(skin/n*220));}
  else if(green/n>0.28){guess="Phong cảnh / thiên nhiên";conf=Math.min(90,55+Math.round(green/n*90));}
  else if(blue/n>0.30 && blueTop/Math.max(1,blue)>0.55){guess="Phong cảnh biển / bầu trời";conf=Math.min(88,52+Math.round(blue/n*85));}
  else if(edgeDensity>0.16){guess="Kiến trúc / đường phố (nhiều đường thẳng)";conf=64;}
  const lightDir = brightN>20 ? `${brightY/brightN < h*0.45 ? "trên" : "dưới"} – ${brightX/brightN < w*0.45 ? "trái" : brightX/brightN > w*0.55 ? "phải":"giữa"}` : "tán xạ (không có vùng cháy sáng rõ)";
  const complexity = edgeDensity<0.05?"Thấp — hợp người mới":edgeDensity<0.11?"Trung bình":edgeDensity<0.18?"Cao — cần đơn giản hóa mạnh ở bước khối":"Rất cao — bắt buộc bỏ 70% chi tiết ở các bước đầu";
  return { w:img.naturalWidth||img.width, h:img.naturalHeight||img.height, aw:w, ah:h,
    ratio:((img.naturalWidth||img.width)/(img.naturalHeight||img.height)),
    orientation:(img.naturalWidth>=img.naturalHeight)?"Ngang (landscape)":"Dọc (portrait)",
    brightness:Math.round(mean), contrast:Math.round(contrast), saturation:Math.round(sumS/n*100),
    warmth: sumR/n - sumB/n, edgeDensity, complexity, palette, guess, conf, lightDir,
    bbox:{x:minX/w,y:minY/h,w:(maxX-minX)/w,h:(maxY-minY)/h}, components:labelComponents(subjMask,w,h),
    centroid:{x:sx/sn/w,y:sy/sn/h}, coverage:Math.round(sn/n*100), gray, data, pw:w, ph:h };
}

/* ---------------- RENDER MINH HỌA TỪNG BƯỚC ---------------- */
const SC=$("#stepCanvas"), SX=SC.getContext("2d");
function baseDraw(ctx,W,H,img){const s=Math.min(W/img.width,H/img.height),w=img.width*s,h=img.height*s;ctx.fillStyle="#f4f1e8";ctx.fillRect(0,0,W,H);ctx.drawImage(img,(W-w)/2,(W-w)/2*0+(H-h)/2,w,h);return{x:(W-w)/2,y:(H-h)/2,w,h};}
function procCanvas(img,fn,max=960){const [w,h]=fitSize(img.naturalWidth||img.width,img.naturalHeight||img.height,max);const c=makeCanvas(w,h),x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0,w,h);const id=x.getImageData(0,0,w,h);fn(id.data,w,h);x.putImageData(id,0,0);return c;}
function grayArr(img,max=960){const {data,w,h}=getPixels(img,max);const d=data.data,g=new Float32Array(w*h);for(let p=0,i=0;p<w*h;p++,i+=4)g[p]=lum(d[i],d[i+1],d[i+2]);return{g,w,h};}
function edgeCanvas(img,strength=1,light=false){const {g,w,h}=grayArr(img);const c=makeCanvas(w,h),x=c.getContext("2d");const id=x.createImageData(w,h),o=id.data;
 for(let yy=1;yy<h-1;yy++)for(let xx=1;xx<w-1;xx++){const p=yy*w+xx;
  const gx=-g[p-w-1]-2*g[p-1]-g[p+w-1]+g[p-w+1]+2*g[p+1]+g[p+w+1];
  const gy=-g[p-w-1]-2*g[p-w]-g[p-w+1]+g[p+w-1]+2*g[p+w]+g[p+w+1];
  let m=Math.hypot(gx,gy)*strength; let v=light? 255-Math.min(255,m)*0.14 : 255-Math.min(255,Math.max(0,m-28));
  o[p*4]=o[p*4+1]=o[p*4+2]=v; o[p*4+3]=255;}
 x.putImageData(id,0,0);return c;}
function drawFitted(ctx,src,W,H){const s=Math.min(W/src.width,H/src.height),w=src.width*s,h=src.height*s;ctx.fillStyle="#f4f1e8";ctx.fillRect(0,0,W,H);ctx.drawImage(src,(W-w)/2,(H-h)/2,w,h);return{x:(W-w)/2,y:(H-h)/2,w,h};}

function renderStep(idx){
  const img=state.img; if(!img)return; const W=SC.width,H=SC.height,a=state.analysis;
  SX.clearRect(0,0,W,H);
  const bboxRect=()=>{const r=drawFitted(SX,img,W,H);return{x:r.x+a.bbox.x*r.w,y:r.y+a.bbox.y*r.h,w:a.bbox.w*r.w,h:a.bbox.h*r.h,base:r};};
  if(idx===0){const r=drawFitted(SX,img,W,H);SX.strokeStyle="rgba(255,60,60,.75)";SX.lineWidth=2;
    for(let i=1;i<3;i++){SX.beginPath();SX.moveTo(r.x+r.w*i/3,r.y);SX.lineTo(r.x+r.w*i/3,r.y+r.h);SX.stroke();SX.beginPath();SX.moveTo(r.x,r.y+r.h*i/3);SX.lineTo(r.x+r.w,r.y+r.h*i/3);SX.stroke();}
    SX.strokeStyle="rgba(255,200,0,.6)";SX.beginPath();SX.moveTo(r.x,r.y);SX.lineTo(r.x+r.w,r.y+r.h);SX.moveTo(r.x+r.w,r.y);SX.lineTo(r.x,r.y+r.h);SX.stroke();}
  else if(idx===1){SX.globalAlpha=.25;const r=drawFitted(SX,img,W,H);SX.globalAlpha=1;const b=bboxRect();
    SX.strokeStyle="#e53170";SX.lineWidth=3;SX.setLineDash([10,7]);SX.strokeRect(b.x,b.y,b.w,b.h);SX.setLineDash([]);
    SX.strokeStyle="#ff8906";SX.lineWidth=2;SX.beginPath();SX.moveTo(b.x+b.w/2,b.y-8);SX.lineTo(b.x+b.w/2,b.y+b.h+8);SX.moveTo(b.x-8,b.y+b.h/2);SX.lineTo(b.x+b.w+8,b.y+b.h/2);SX.stroke();
    SX.fillStyle="#e53170";SX.font="bold 20px sans-serif";SX.fillText("KHUNG BAO CHỦ THỂ",Math.max(10,b.x),Math.max(24,b.y-12));}
  else if(idx===2){const small=procCanvas(img,(d,w,h)=>{},26);SX.imageSmoothingEnabled=false;drawFitted(SX,small,W,H);SX.imageSmoothingEnabled=true;
    SX.fillStyle="rgba(20,16,40,.82)";SX.fillRect(12,H-44,560,32);SX.fillStyle="#fff";SX.font="bold 16px sans-serif";SX.fillText("BLOCK-IN: gộp chi tiết thành khối lớn — đừng nhìn chi tiết ở bước này",22,H-22);}
  else if(idx===3){SX.globalAlpha=.35;drawFitted(SX,img,W,H);SX.globalAlpha=1;const b=bboxRect();
    SX.strokeStyle="rgba(30,120,255,.8)";SX.lineWidth=1.6;for(let i=1;i<4;i++){SX.beginPath();SX.moveTo(b.x+b.w*i/4,b.y);SX.lineTo(b.x+b.w*i/4,b.y+b.h);SX.stroke();SX.beginPath();SX.moveTo(b.x,b.y+b.h*i/4);SX.lineTo(b.x+b.w,b.y+b.h*i/4);SX.stroke();}
    SX.strokeStyle="#e53170";SX.lineWidth=2.5;SX.strokeRect(b.x,b.y,b.w,b.h);
    SX.fillStyle="#ffd400";const pts=[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h],[b.base.x+a.centroid.x*b.base.w,b.base.y+a.centroid.y*b.base.h]];
    pts.forEach(p=>{SX.beginPath();SX.arc(p[0],p[1],8,0,7);SX.fill();SX.strokeStyle="#111";SX.lineWidth=2;SX.stroke();});
    SX.fillStyle="#111";SX.font="bold 17px sans-serif";SX.fillText("● ĐIỂM NEO + TRỌNG TÂM (vàng)",14,26);}
  else if(idx===4){const c=procCanvas(img,(d)=>{for(let i=0;i<d.length;i+=4){const L=lum(d[i],d[i+1],d[i+2]);const q=Math.round(L/64)*64;d[i]=d[i+1]=d[i+2]=q;}});
    const b=(()=>{const r=drawFitted(SX,c,W,H);return{x:r.x+a.bbox.x*r.w,y:r.y+a.bbox.y*r.h,w:a.bbox.w*r.w,h:a.bbox.h*r.h};})();
    SX.strokeStyle="rgba(229,49,112,.9)";SX.lineWidth=3;SX.strokeRect(b.x,b.y,b.w,b.h);
    SX.beginPath();SX.ellipse(b.x+b.w/2,b.y+b.h/2,b.w/2.4,b.h/2.4,0,0,7);SX.stroke();
    SX.beginPath();SX.moveTo(b.x+b.w/2,b.y);SX.lineTo(b.x+b.w/2,b.y+b.h);SX.stroke();
    SX.fillStyle="#e53170";SX.font="bold 17px sans-serif";SX.fillText("KHỐI CƠ BẢN BÊN TRONG: hộp / trụ / cầu",14,26);}
  else if(idx===5){const {data,pw,ph}=a;const c=makeCanvas(pw,ph),x=c.getContext("2d");const id=x.createImageData(pw,ph),o=id.data;const d=data.data;
    // rebuild bg from analysis data corners approximation: use threshold on distance stored? recompute quick via luminance+colour dist to corner colour
    const corners=[[0,0],[pw-1,0],[0,ph-1],[pw-1,ph-1]].map(([cx,cy])=>{const ii=(cy*pw+cx)*4;return[d[ii],d[ii+1],d[ii+2]];});
    for(let p=0,i=0;p<pw*ph;p++,i+=4){let dist=1e9;for(const cc of corners){const dd=Math.hypot(d[i]-cc[0],d[i+1]-cc[1],d[i+2]-cc[2]);if(dd<dist)dist=dd;}const v=dist>52?18:245;o[i]=o[i+1]=o[i+2]=v;o[i+3]=255;}
    x.putImageData(id,0,0);drawFitted(SX,c,W,H);
    SX.fillStyle="#111";SX.font="bold 17px sans-serif";SX.fillText("SILHOUETTE: chỉ còn dương hình / âm hình",14,26);}
  else if(idx===6){const c=edgeCanvas(img,1,true);drawFitted(SX,c,W,H);
    SX.fillStyle="rgba(70,60,40,.9)";SX.font="bold 17px sans-serif";SX.fillText("SAU KHI TẨY DẺO: đường dựng chỉ còn 'bóng ma' ~15%",14,26);}
  else if(idx===7){const c=edgeCanvas(img,1.15,false);drawFitted(SX,c,W,H);}
  else if(idx===8){const c=procCanvas(img,(d)=>{for(let i=0;i<d.length;i+=4){const L=lum(d[i],d[i+1],d[i+2]);const q=L<85?38:L<170?138:238;d[i]=d[i+1]=d[i+2]=q;}});drawFitted(SX,c,W,H);}
  else if(idx===9){const c=procCanvas(img,(d)=>{for(let i=0;i<d.length;i+=4){let L=lum(d[i],d[i+1],d[i+2])/255;L=Math.pow(L,1.25)*255;d[i]=d[i+1]=d[i+2]=L;}});drawFitted(SX,c,W,H);}
  else if(idx===10){const r=drawFitted(SX,img,W,H);const cx=r.x+a.centroid.x*r.w, cy=r.y+a.centroid.y*r.h;
    SX.save();SX.beginPath();SX.arc(cx,cy,92,0,7);SX.clip();
    const sw=Math.min(img.naturalWidth,img.naturalHeight)*0.34, sx0=Math.max(0,Math.min(img.naturalWidth-sw, a.centroid.x*img.naturalWidth-sw/2)), sy0=Math.max(0,Math.min(img.naturalHeight-sw, a.centroid.y*img.naturalHeight-sw/2));
    SX.drawImage(img,sx0,sy0,sw,sw,cx-92,cy-92,184,184);SX.restore();
    SX.beginPath();SX.arc(cx,cy,92,0,7);SX.strokeStyle="#ff8906";SX.lineWidth=5;SX.stroke();
    SX.fillStyle="#ff8906";SX.font="bold 17px sans-serif";SX.fillText("LOUPE TẠI TRỌNG TÂM — VÙNG CHI TIẾT 100%",14,26);}
  else if(idx===11){const c=procCanvas(img,(d)=>{for(let i=0;i<d.length;i+=4){d[i]=Math.round(d[i]/52)*52;d[i+1]=Math.round(d[i+1]/52)*52;d[i+2]=Math.round(d[i+2]/52)*52;}});
    drawFitted(SX,c,W,H);const pw2=W-28; a.palette.forEach((p,i)=>{SX.fillStyle=p.hex;SX.fillRect(14+i*(pw2/a.palette.length),H-40,pw2/a.palette.length-4,26);});}
  else {const r=drawFitted(SX,img,W,H);const gr=SX.createRadialGradient(W/2,H/2,H/3,W/2,H/2,W/1.3);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,"rgba(10,8,20,.45)");SX.fillStyle=gr;SX.fillRect(0,0,W,H);}
  // compare overlay with original
  if(state.compare>0){SX.save();SX.globalAlpha=state.compare/100;SX.beginPath();SX.rect(0,0,W*state.compare/100,H);SX.clip();drawFitted(SX,img,W,H);SX.restore();
    SX.strokeStyle="#ff8906";SX.lineWidth=3;SX.beginPath();SX.moveTo(W*state.compare/100,0);SX.lineTo(W*state.compare/100,H);SX.stroke();}
  renderGhost();
}

/* ---------------- GIAO DIỆN ---------------- */
function showAnalysis(){
  const a=state.analysis; $("#phan-tich").hidden=false; $("#lo-trinh").hidden=false; $("#ve-tung-buoc").hidden=false; $("#luyen-tap").hidden=false; $("#ai-vision").hidden=false; $("#ve-that").hidden=false; setTimeout(prepareStrokes,60);
  $("#analysisSummary").textContent=`AI dự đoán chủ thể: ${a.guess} (độ tin cậy ${a.conf}%). Mọi con số dưới đây được đo trực tiếp từ ${a.w}×${a.h}px của ảnh bạn tải — hãy dùng chúng làm 'đề bài' cho 13 bước vẽ.`;
  const stats=[
    ["Kích thước gốc",`${a.w} × ${a.h} px`,`Tỉ lệ khung ${a.ratio.toFixed(2)} : 1 — ${a.orientation}. Hãy cắt giấy đúng tỉ lệ này, đừng vẽ trên giấy tỉ lệ khác rồi cố nhét vào.`],
    ["Chủ thể chiếm khung",`${a.coverage}%`,`Khung bao đo được: rộng ${Math.round(a.bbox.w*100)}% × cao ${Math.round(a.bbox.h*100)}% khung hình. Đây là số bạn phải tái hiện ở Bước 2.`],
    ["Trọng tâm thị giác",`${Math.round(a.centroid.x*100)}% · ${Math.round(a.centroid.y*100)}%`,`Tính từ góc trái-trên. Trọng tâm ${Math.abs(a.centroid.x-.5)<.09&&Math.abs(a.centroid.y-.5)<.09?"nằm gần giữa — bố cục tĩnh, trang trọng":"lệch khỏi tâm — bố cục động, hãy giữ đúng độ lệch đó, đừng 'cân' lại theo thói quen"}.`],
    ["Độ sáng trung bình",`${a.brightness} / 255`,a.brightness>165?"Ảnh sáng (high-key): mảng tối rất quý — phải giữ chúng thật đậm để tranh không bị nhạt.":a.brightness<95?"Ảnh tối (low-key): vùng sáng hiếm hoi chính là điểm nhấn, bảo vệ giấy trắng ở đó bằng mọi giá.":"Ảnh cân bằng sáng — thuận lợi cho người mới."],
    ["Tương phản sắc độ",`${a.contrast} / 128`,a.contrast>58?"Tương phản mạnh: ranh giới sáng/tối rõ — rất hợp luyện Bước 9–10 (sắc độ & bóng).":a.contrast<32?"Tương phản yếu: bạn sẽ phải CHỦ ĐỘNG đẩy mảng tối đậm hơn mẫu một chút, nếu không tranh sẽ xám đều.":"Tương phản vừa — giữ đúng như mẫu là đủ."],
    ["Độ bão hòa màu",`${a.saturation}%`,a.saturation>45?"Màu rực: ở Bước 12 chỉ giữ độ rực này ở điểm nhấn, phần còn lại giảm bão hòa đi 30%.":a.saturation<18?"Màu trầm/gần đơn sắc: có thể vẽ bản chì hoàn chỉnh và chỉ 'nhuộm' màu rất nhẹ ở bước cuối.":"Màu vừa phải — lên màu theo đúng palette trích xuất bên cạnh."],
    ["Hướng ánh sáng",a.lightDir,`Bóng đổ sẽ chạy về phía ngược lại. Hãy vẽ một mũi tên sáng nhỏ ở góc giấy ngay từ Bước 1 và không bao giờ đổi hướng giữa chừng.`],
    ["Độ phức tạp chi tiết",a.complexity,`Mật độ đường nét đo được: ${(a.edgeDensity*100).toFixed(1)}%. Quy tắc: bước khối chỉ giữ lại khoảng ${a.edgeDensity>0.15?"10–15":"25–30"} đường quan trọng nhất.`]
  ];
  $("#statGrid").innerHTML=stats.map(s=>`<div class="stat"><small>${s[0]}</small><b>${s[1]}</b><span>${s[2]}</span></div>`).join("");
  $("#palette").innerHTML=a.palette.map(p=>`<div class="swatch"><i style="background:${p.hex}"></i><small>${p.hex}<br>${p.pct}% ảnh</small></div>`).join("");
  $("#paletteNote").textContent=`6 màu này phủ ${a.palette.reduce((s,p)=>s+p.pct,0)}% diện tích ảnh. Ở Bước 12, hãy pha sẵn đúng 6 màu này trước khi vẽ — đó là 'bảng màu của riêng bức tranh này'.`;
  const notes=[];
  notes.push(`Chủ thể (${a.guess.toLowerCase()}) chiếm ${a.coverage}% khung với khung bao ${Math.round(a.bbox.w*100)}×${Math.round(a.bbox.h*100)}%. Sai lệch khung bao quá 5% ở Bước 2 sẽ kéo sai toàn bộ các bước sau.`);
  notes.push(a.warmth>12?`Ảnh thiên ẤM (đỏ nhiều hơn xanh dương ${Math.round(a.warmth)} điểm): ánh sáng có vẻ từ nắng/lửa/đèn vàng. Khi lên màu, giữ bóng hơi lạnh để tương phản nhiệt độ.` : a.warmth<-12?`Ảnh thiên LẠNH (xanh dương trội hơn ${Math.round(-a.warmth)} điểm): hợp không khí sáng sớm/biển/trời âm u. Đừng pha màu quá ấm ở vùng sáng.`:`Ảnh cân bằng nhiệt độ màu — bạn tự do đẩy nhẹ vùng sáng ấm / vùng bóng lạnh ở Bước 12 để tạo 'nắng'.`);
  notes.push(`Hướng sáng chính: ${a.lightDir}. Mọi bóng đổ trong bài vẽ của bạn phải nhất quán với hướng này — chỉ cần một bóng sai hướng là mắt người xem thấy 'giả' ngay.`);
  if(a.edgeDensity>0.15) notes.push(`CẢNH BÁO CHI TIẾT: mật độ nét rất cao. Ở Bước 3 (block-in) hãy tàn nhẫn gộp chi tiết: mỗi vùng chỉ giữ đường bao ngoài. Chi tiết sẽ quay lại ở Bước 11 — đúng một lần, đúng chỗ.`);
  if(a.contrast<32) notes.push(`Ảnh tương phản thấp: khi vẽ, hãy nheo mắt thật kỹ ở Bước 9 để tìm mảng tối — chúng rất gần nhau. Cho phép bạn đậm hơn mẫu tối đa 1 nấc ở mảng tối nhất.`);
  if(Math.abs(a.centroid.x-1/3)<0.07||Math.abs(a.centroid.x-2/3)<0.07) notes.push(`Trọng tâm thị giác đang nằm gần đường 1/3 dọc — đây là bố cục 'vàng'. Khi đặt giấy, canh khung bao sao cho trọng tâm rơi đúng vị trí tương ứng.`);
  $("#aiNotes").innerHTML=notes.map(n=>`<li>${n}</li>`).join("");
  $("#verdict").innerHTML=`<b>Kế hoạch của bạn:</b> bắt đầu từ Bước 1 ngay bên dưới. Ước lượng tổng thời gian cho cả 13 bước: khoảng 4–6 giờ vẽ tập trung (chia 3–4 buổi). Đừng làm tất cả trong một buổi — mắt mệt sẽ hết thấy lỗi tỉ lệ.`;
  // composition canvas
  const cc=$("#compCanvas"),cx2=cc.getContext("2d");cx2.fillStyle="#0a0912";cx2.fillRect(0,0,cc.width,cc.height);
  const s=Math.min(cc.width/a.aw,cc.height/a.ah),dw=a.aw*s,dh=a.ah*s,ox=(cc.width-dw)/2,oy=(cc.height-dh)/2;
  cx2.drawImage(state.img,ox,oy,dw,dh);
  cx2.strokeStyle="rgba(255,255,255,.55)";cx2.lineWidth=1;for(let i=1;i<3;i++){cx2.beginPath();cx2.moveTo(ox+dw*i/3,oy);cx2.lineTo(ox+dw*i/3,oy+dh);cx2.stroke();cx2.beginPath();cx2.moveTo(ox,oy+dh*i/3);cx2.lineTo(ox+dw,oy+dh*i/3);cx2.stroke();}
  state.compT={ox,oy,dw,dh};
  cx2.strokeStyle="#ff3355";cx2.lineWidth=3;cx2.strokeRect(ox+a.bbox.x*dw,oy+a.bbox.y*dh,a.bbox.w*dw,a.bbox.h*dh);
  cx2.fillStyle="#ffd400";cx2.beginPath();cx2.arc(ox+a.centroid.x*dw,oy+a.centroid.y*dh,8,0,7);cx2.fill();
  // roadmap
  $("#roadmap").innerHTML=STEPS.map((s2,i)=>`<button class="step-card ${state.done.has(i)?"done":""}" data-step="${i}" type="button"><span class="num">${state.done.has(i)?"✓":i+1}</span><b>${s2.title}</b><small>${s2.tagline}</small><span class="lvl">${s2.level} · ⏱ ${s2.time}</span></button>`).join("");
  document.querySelectorAll(".step-card").forEach(el=>el.onclick=()=>{showStep(+el.dataset.step);document.querySelector("#ve-tung-buoc").scrollIntoView({behavior:"smooth"});});
  showStep(state.step);
}
function showStep(i){
  state.step=Math.max(0,Math.min(STEPS.length-1,i)); const s=STEPS[state.step];
  $("#stepTitle").textContent=`Bước ${state.step+1}/13 — ${s.title}`;
  $("#stepTagline").textContent=s.tagline;
  $("#stepProgressBar").style.width=((state.step+1)/13*100)+"%";
  $("#stepProgressText").textContent=`Hoàn thành ${state.done.size}/13 bước đã tự đánh dấu`;
  $("#stepCanvasCaption").textContent="📐 "+s.caption;
  $("#stepDetail").innerHTML=`
    <div class="meta"><span class="chip">📚 ${s.level}</span><span class="chip">⏱ ${s.time}</span><span class="chip">🧰 ${s.tools}</span></div>
    <h3>🎯 Mục tiêu của bước</h3><p class="hint" style="color:#d9d6f2;font-size:14.5px">${s.goal}</p>${visionAdviceHTML(state.step)}
    <h3>✍️ Cách làm — chi tiết từng thao tác</h3><ol>${s.how.map(x=>`<li>${x}</li>`).join("")}</ol>
    <h3>⚠️ Lỗi thường gặp</h3><div class="warn"><ul>${s.mistakes.map(x=>`<li>${x}</li>`).join("")}</ul></div>
    <h3>✅ Tự kiểm tra trước khi qua bước sau</h3>
    ${s.criteria.map(c=>`<label class="checkline"><input type="checkbox" class="crit"> <span>${c}</span></label>`).join("")}
    <div class="okbox"><b>🏋️ Bài tập củng cố:</b> ${s.exercise}</div>
    <p style="margin-top:16px"><button class="btn btn-primary btn-small" id="markDone" type="button">${state.done.has(state.step)?"✓ Đã đánh dấu xong — bấm để bỏ":"Đánh dấu: tôi đã làm xong bước này"}</button></p>`;
  const crits=$("#stepDetail").querySelectorAll(".crit");
  crits.forEach(c=>c.onchange=()=>{ if([...crits].every(x=>x.checked)){state.done.add(state.step);} });
  $("#markDone").onclick=()=>{state.done.has(state.step)?state.done.delete(state.step):state.done.add(state.step);showAnalysisSoft();showStep(state.step);};
  renderStep(state.step);
}
function showAnalysisSoft(){ // refresh roadmap checkmarks without resetting analysis scroll
  document.querySelectorAll(".step-card").forEach((el,i)=>{el.classList.toggle("done",state.done.has(i));el.querySelector(".num").textContent=state.done.has(i)?"✓":i+1;});
  $("#stepProgressText").textContent=`Hoàn thành ${state.done.size}/13 bước đã tự đánh dấu`;
}
$("#prevStep").onclick=()=>showStep(state.step-1);
$("#nextStep").onclick=()=>showStep(state.step+1);
$("#compareRange").oninput=e=>{state.compare=+e.target.value;$("#compareVal").textContent=state.compare+"%";renderStep(state.step);};
$("#downloadStep").onclick=()=>{const a=document.createElement("a");a.download=`buoc-${state.step+1}.png`;a.href=SC.toDataURL("image/png");a.click();};
$("#playSteps").onclick=e=>{
  if(state.playing){clearInterval(state.playing);state.playing=null;e.target.textContent="▶ Trình chiếu từng bước";return;}
  e.target.textContent="⏸ Dừng trình chiếu";
  state.playing=setInterval(()=>{ if(state.step>=STEPS.length-1){clearInterval(state.playing);state.playing=null;$("#playSteps").textContent="▶ Trình chiếu từng bước";return;} showStep(state.step+1); },2600);
};

/* ---------------- TẢI ẢNH ---------------- */
function loadFromFile(file){
  if(!file||!file.type.startsWith("image/"))return;
  const url=URL.createObjectURL(file); const img=new Image();
  img.onload=()=>{ state.img=img; state.imgURL=url;
    $("#previewImg").src=url; $("#previewWrap").hidden=false; $("#dropzone").hidden=true;
    $("#fileMeta").textContent=`${file.name} · ${(file.size/1024).toFixed(0)} KB · ${img.naturalWidth}×${img.naturalHeight}px`;
    $("#analyzeProgress").hidden=false;
    setTimeout(()=>{ state.analysis=analyze(img); state.step=0; state.done=new Set();
      $("#analyzeProgress").hidden=true; showAnalysis();
      document.querySelector("#phan-tich").scrollIntoView({behavior:"smooth"});
      initPracticeSize();
    },350);
  };
  img.src=url;
}
const dz=$("#dropzone");
dz.onclick=e=>{if(e.target.tagName!=="BUTTON")$("#fileInput").click();};
$("#pickBtn").onclick=()=>$("#fileInput").click();
$("#changeBtn").onclick=()=>$("#fileInput").click();
$("#fileInput").onchange=e=>loadFromFile(e.target.files[0]);
["dragover","dragenter"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("drag");}));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("drag");}));
dz.addEventListener("drop",e=>loadFromFile(e.dataTransfer.files[0]));
document.addEventListener("paste",e=>{const f=[...e.clipboardData.files][0];if(f)loadFromFile(f);});

/* Ảnh mẫu: tĩnh vật vẽ bằng canvas (bình + quả + nền) để thử ngay không cần file */
$("#sampleBtn").onclick=()=>{
  const c=makeCanvas(900,680),x=c.getContext("2d");
  const sky=x.createLinearGradient(0,0,0,680);sky.addColorStop(0,"#f7d794");sky.addColorStop(.62,"#f3a683");sky.addColorStop(.621,"#786fa6");sky.addColorStop(1,"#574b90");x.fillStyle=sky;x.fillRect(0,0,900,680);
  x.fillStyle="#ffd32a";x.beginPath();x.arc(742,128,62,0,7);x.fill();
  x.fillStyle="#30336b";x.fillRect(0,470,900,14);
  x.fillStyle="#8854d0";x.beginPath();x.moveTo(330,470);x.bezierCurveTo(300,330,360,300,398,238);x.lineTo(452,238);x.bezierCurveTo(490,300,550,330,520,470);x.closePath();x.fill();
  x.fillStyle="#a55eea";x.fillRect(392,196,66,48);x.fillStyle="#8854d0";x.fillRect(382,188,86,16);
  x.fillStyle="#20bf6b";x.beginPath();x.ellipse(452,168,16,44,0.5,0,7);x.fill();
  x.fillStyle="#eb3b5a";x.beginPath();x.arc(598,408,64,0,7);x.fill();x.fillStyle="#fc5c65";x.beginPath();x.arc(576,384,24,0,7);x.fill();
  x.fillStyle="#e84118";x.beginPath();x.arc(238,428,48,0,7);x.fill();x.strokeStyle="#4a2c14";x.lineWidth=7;x.beginPath();x.moveTo(238,382);x.quadraticCurveTo(248,356,272,350);x.stroke();
  x.fillStyle="rgba(0,0,0,.28)";x.beginPath();x.ellipse(425,492,215,22,0,0,7);x.fill();
  c.toBlob(b=>{const f=new File([b],"anh-mau-tinh-vat.png",{type:"image/png"});loadFromFile(f);});
};

/* ---------------- PHÒNG LUYỆN TẬP ---------------- */
const DC=$("#drawCanvas"),DX=DC.getContext("2d"),GC=$("#ghostCanvas"),GX=GC.getContext("2d");
let drawing=false,tool="pencil",last=null,undoStack=[];
function renderGhost(){ if(!state.img)return; GX.clearRect(0,0,GC.width,GC.height); GX.globalAlpha=(+$("#ghostRange").value)/100;
  // draw current step illustration as ghost by copying step canvas
  GX.drawImage(SC,0,0); GX.globalAlpha=1; }
function initPracticeSize(){ renderGhost(); }
$("#ghostRange").oninput=renderGhost;
document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>{tool=b.dataset.tool;document.querySelectorAll(".tool").forEach(x=>x.classList.toggle("active",x===b));});
function pos(e){const r=DC.getBoundingClientRect();return{x:(e.clientX-r.left)*DC.width/r.width,y:(e.clientY-r.top)*DC.height/r.height};}
DC.addEventListener("pointerdown",e=>{drawing=true;last=pos(e);undoStack.push(DX.getImageData(0,0,DC.width,DC.height));if(undoStack.length>25)undoStack.shift();DC.setPointerCapture(e.pointerId);});
DC.addEventListener("pointermove",e=>{if(!drawing)return;const p=pos(e);DX.lineCap="round";DX.lineJoin="round";
  if(tool==="pencil"){DX.globalCompositeOperation="source-over";DX.strokeStyle="rgba(45,40,35,.88)";DX.lineWidth=+$("#brushSize").value;}
  else{DX.globalCompositeOperation="destination-out";DX.strokeStyle="rgba(0,0,0,1)";DX.lineWidth=+$("#brushSize").value*2.2;}
  DX.beginPath();DX.moveTo(last.x,last.y);DX.lineTo(p.x,p.y);DX.stroke();last=p;});
["pointerup","pointerleave"].forEach(ev=>DC.addEventListener(ev,()=>drawing=false));
$("#undoDraw").onclick=()=>{const u=undoStack.pop();if(u)DX.putImageData(u,0,0);};
$("#clearDraw").onclick=()=>{undoStack.push(DX.getImageData(0,0,DC.width,DC.height));DX.clearRect(0,0,DC.width,DC.height);};
$("#downloadDraw").onclick=()=>{const out=makeCanvas(DC.width,DC.height),ox=out.getContext("2d");ox.fillStyle="#f4f1e8";ox.fillRect(0,0,out.width,out.height);ox.drawImage(GC,0,0);ox.drawImage(DC,0,0);const a=document.createElement("a");a.download="bai-ve-cua-toi.png";a.href=out.toDataURL("image/png");a.click();};

/* ---------------- AI VISION (BYOK — key của chính người dùng) ---------------- */
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const VPRESETS={
  openai:{endpoint:"https://api.openai.com/v1",model:"gpt-4o-mini"},
  oxion:{endpoint:"https://oxionai.com/v1",model:""},
  intern:{endpoint:"https://discovery-api.intern-ai.org.cn/v1",model:"deepseek-v4-flash-vision"},
  gemini:{endpoint:"https://generativelanguage.googleapis.com/v1beta/openai/",model:"gemini-2.5-flash"},
  openrouter:{endpoint:"https://openrouter.ai/api/v1",model:"google/gemma-4-31b-it:free"},
  groq:{endpoint:"https://api.groq.com/openai/v1",model:"qwen/qwen3.8-27b"},
  xingchi:{endpoint:"https://api.xingchiapi.com/v1",model:"gpt-6.1-sol"},
  custom:{endpoint:"",model:""}
};
const ADVICE_KEYS=["quan_sat","khung_bao","block_in","diem_neo","cau_truc_3d","am_hinh","tay_duong_dung","net_chinh","sac_do","do_bong","chi_tiet","len_mau","hoan_thien"];
function visionAdviceHTML(i){
  const adv=state.vision&&state.vision.step_advice&&state.vision.step_advice[ADVICE_KEYS[i]];
  return adv?`<h3>🤖 AI Vision khuyên riêng cho ảnh này</h3><div class="vision-advice">${esc(adv)}</div>`:"";
}
function vCfg(){return{preset:$("#vPreset").value,endpoint:$("#vEndpoint").value.trim().replace(/\/+$/,""),model:$("#vModel").value.trim(),key:$("#vKey").value.trim(),remember:$("#vRemember").checked};}
function vFill(cfg){ if(!cfg)return; $("#vPreset").value=cfg.preset||"openai"; $("#vEndpoint").value=cfg.endpoint||""; $("#vModel").value=cfg.model||""; $("#vRemember").checked=!!cfg.remember; if(cfg.key)$("#vKey").value=cfg.key; }
try{ const saved=JSON.parse(localStorage.getItem("hocve_vision_cfg")||"null"); if(saved) vFill(saved); else { const p=VPRESETS.gemini; $("#vPreset").value="gemini"; $("#vEndpoint").value=p.endpoint; $("#vModel").value=p.model; } }catch(e){}
$("#vPreset").onchange=e=>{const p=VPRESETS[e.target.value]; if(p){ if(p.endpoint)$("#vEndpoint").value=p.endpoint; if(p.model)$("#vModel").value=p.model; if(e.target.value==="xingchi")$("#vStatus").textContent="⚠️ XingChi: đã kiểm chứng bằng key thật — key hợp lệ và tài khoản chỉ có model gpt-6.1-sol, NHƯNG XingChi chặn gọi API từ trình duyệt/script (lỗi 403 client_not_allowed): cổng này chỉ cho các app lập trình (DeepSeek Harness, Cursor, Cline…) gọi. Vì vậy phân tích vision trên web bằng XingChi sẽ bị chặn — hãy dùng OpenAI / Gemini / Oxion cho web, XingChi để dành cho Harness."; }};
$("#vSave").onclick=()=>{const c=vCfg(); const store={preset:c.preset,endpoint:c.endpoint,model:c.model,remember:c.remember}; if(c.remember&&c.key)store.key=c.key;
  try{localStorage.setItem("hocve_vision_cfg",JSON.stringify(store));}catch(e){}
  sessionStorage.setItem("hocve_vision_key",c.key||"");
  $("#vStatus").textContent="✅ Đã lưu cài đặt"+(c.remember?" (kể cả key, chỉ trên trình duyệt này).":" (không lưu key — key chỉ giữ trong phiên này).");};
function vKeyNow(){return $("#vKey").value.trim()||sessionStorage.getItem("hocve_vision_key")||"";}
function vErr(status,body){
  const hints={400:"Yêu cầu bị từ chối — thường do model không hỗ trợ ảnh (không có vision) hoặc sai định dạng.",401:"Key sai hoặc hết hiệu lực (401). Kiểm tra lại key.",402:"Hết hạn mức/số dư của gói (402) — nạp thêm hoặc đổi key khác.",403:"Bị chặn quyền (403). Với XingChi: cổng chỉ cho app lập trình (DeepSeek Harness, Cursor, Cline…) — trình duyệt và script bị chặn theo chính sách của XingChi (client_not_allowed), không phải do key sai.",404:"Không tìm thấy endpoint/model (404) — kiểm tra Base URL và Model ID.",429:"Rate limit (429) — chờ một lát rồi thử lại."};
  return `❌ API trả lỗi ${status}. ${hints[status]||""} Chi tiết: ${String(body||"").slice(0,220)}`;
}
async function vFetch(path,options={}){
  const c=vCfg(), key=vKeyNow();
  if(!c.endpoint) throw new Error("Chưa điền Base URL.");
  if(!key) throw new Error("Chưa có API key — hãy dán key của bạn vào ô API Key trước.");
  if(!c.model&&path.includes("chat")) throw new Error("Chưa điền Model ID.");
  const res=await fetch(c.endpoint+path,{...options,headers:{"Content-Type":"application/json","Authorization":"Bearer "+key,...(options.headers||{})}});
  return res;
}
$("#vTest").onclick=async()=>{
  $("#vStatus").textContent="🔌 Đang gọi GET /models để kiểm tra key…";
  try{ const res=await vFetch("/models",{method:"GET"});
    if(res.ok){const j=await res.json().catch(()=>null); const n=j&&j.data?j.data.length:"?"; $("#vStatus").textContent=`✅ Kết nối OK — key hợp lệ, cổng trả về ${n} model. Hãy chắc chắn Model ID bạn điền có trong danh sách đó và có vision.`;}
    else $("#vStatus").textContent=vErr(res.status,await res.text());
  }catch(e){ $("#vStatus").textContent="❌ Không gọi được API: "+e.message+" — có thể do sai Base URL, mất mạng, hoặc cổng chặn CORS từ trình duyệt (một số cổng chỉ cho gọi từ server/app, khi đó hãy dùng cổng OpenAI/Oxion/Gemini)."; }
};
const VISION_PROMPT=`Bạn là chuyên gia dạy vẽ. Hãy nhìn bức ảnh này và trả về DUY NHẤT một JSON (không markdown, không giải thích ngoài JSON) đúng cấu trúc sau, mọi nội dung bằng tiếng Việt:
{"subject_type":"loại chủ thể (chân dung/phong cảnh/tĩnh vật/kiến trúc/động vật/khác)","confidence":0-100,"summary":"2-3 câu tóm tắt nội dung ảnh","subjects":[{"name":"tên chủ thể/vật thể","bbox_pct":{"x":0-100,"y":0-100,"w":0-100,"h":0-100},"importance":"chính hoặc phụ","description":"1 câu"}],"composition":"phân tích bố cục 2-3 câu","light":{"direction":"hướng sáng","quality":"chất lượng sáng (gắt/dịu/tán xạ)","shadow_notes":"ghi chú về bóng đổ"},"style":"phong cách/thể loại của ảnh","mood":"cảm xúc tổng thể","key_details":["chi tiết then chốt không được bỏ qua khi vẽ"],"risks":["điểm dễ vẽ sai ở ảnh này"],"palette_hex":["#RRGGBB tối đa 6 màu chủ đạo"],"step_advice":{"quan_sat":"","khung_bao":"","block_in":"","diem_neo":"","cau_truc_3d":"","am_hinh":"","tay_duong_dung":"","net_chinh":"","sac_do":"","do_bong":"","chi_tiet":"","len_mau":"","hoan_thien":""}}
Trong step_advice, mỗi ô viết 1-2 câu khuyên CỤ THỂ cho đúng ảnh này ở bước vẽ tương ứng (ví dụ ở tay_duong_dung: đường dựng nào nên tẩy trước; ở do_bong: bóng nào quan trọng nhất). bbox_pct tính theo % chiều rộng/cao của toàn ảnh, (x,y) là góc trái-trên.`;
function parseVisionJSON(text){
  if(!text) throw new Error("API không trả nội dung.");
  let s=String(text).trim().replace(/^```(?:json)?/i,"").replace(/```$/,"").trim();
  const a=s.indexOf("{"), b=s.lastIndexOf("}"); if(a>=0&&b>a) s=s.slice(a,b+1);
  const obj=JSON.parse(s);
  if(typeof obj!=="object"||!obj) throw new Error("JSON không hợp lệ.");
  obj.subjects=Array.isArray(obj.subjects)?obj.subjects:[];
  obj.key_details=Array.isArray(obj.key_details)?obj.key_details:[]; obj.risks=Array.isArray(obj.risks)?obj.risks:[];
  obj.palette_hex=Array.isArray(obj.palette_hex)?obj.palette_hex:[]; obj.step_advice=obj.step_advice||{}; obj.light=obj.light||{};
  return obj;
}
function downscaledDataURL(img){
  const [w,h]=fitSize(img.naturalWidth||img.width,img.naturalHeight||img.height,1024);
  const c=makeCanvas(w,h),x=c.getContext("2d"); x.fillStyle="#fff"; x.fillRect(0,0,w,h); x.drawImage(img,0,0,w,h);
  return c.toDataURL("image/jpeg",0.82);
}
function drawVisionBoxes(){
  if(!state.compT||!state.vision) return; const {ox,oy,dw,dh}=state.compT, cx2=$("#compCanvas").getContext("2d");
  cx2.save(); cx2.lineWidth=2.5; cx2.font="bold 13px sans-serif";
  state.vision.subjects.forEach((s2,i)=>{ const b=s2.bbox_pct||{}; const x=ox+(+b.x||0)/100*dw, y=oy+(+b.y||0)/100*dh, w2=(+b.w||0)/100*dw, h2=(+b.h||0)/100*dh;
    if(w2<4||h2<4)return; const col=i===0?"#2cb67d":"#00b4d8"; cx2.strokeStyle=col; cx2.strokeRect(x,y,w2,h2);
    cx2.fillStyle=col; const label=esc(s2.name||`Chủ thể ${i+1}`); cx2.fillRect(x,Math.max(0,y-20),Math.min(220,label.length*8.5+12),19);
    cx2.fillStyle="#06121f"; cx2.fillText(s2.name||`Chủ thể ${i+1}`,x+6,Math.max(14,y-6)); });
  cx2.restore();
}
function renderVision(v){
  const box=$("#visionResult"); box.hidden=false;
  box.innerHTML=`
   <div class="verdict" style="margin-top:0"><b>👁️ AI Vision nhận diện:</b> ${esc(v.subject_type||"—")} <b>(${esc(v.confidence??"—")}%)</b> — ${esc(v.summary||"")}</div>
   <h4>🧩 Các chủ thể AI nhìn thấy (khung xanh đã vẽ lên sơ đồ bố cục ở phần Phân tích)</h4>
   <div>${v.subjects.map(s2=>`<span class="subject-chip">${esc(s2.importance==="chính"?"⭐ ":"")}${esc(s2.name||"")} · ${esc(Math.round(s2.bbox_pct?.w||0))}×${esc(Math.round(s2.bbox_pct?.h||0))}% khung</span>`).join("")||"<span class='hint'>AI không liệt kê chủ thể riêng lẻ.</span>"}</div>
   ${v.subjects.map(s2=>s2.description?`<p class="hint">• <b style="color:var(--text)">${esc(s2.name||"")}</b> — ${esc(s2.description)}</p>`:"").join("")}
   <h4>🧭 Bố cục · 💡 Ánh sáng · 🎭 Phong cách & cảm xúc</h4>
   <ul><li><b>Bố cục:</b> ${esc(v.composition||"—")}</li>
   <li><b>Ánh sáng:</b> ${esc(v.light.direction||"—")} · ${esc(v.light.quality||"")} ${v.light.shadow_notes?`— ${esc(v.light.shadow_notes)}`:""}</li>
   <li><b>Phong cách:</b> ${esc(v.style||"—")} · <b>Cảm xúc:</b> ${esc(v.mood||"—")}</li></ul>
   <h4>🔑 Chi tiết then chốt</h4><ul>${v.key_details.map(d=>`<li>${esc(d)}</li>`).join("")||"<li>—</li>"}</ul>
   <h4>⚠️ Rủi ro dễ vẽ sai ở ảnh này</h4><ul>${v.risks.map(d=>`<li>${esc(d)}</li>`).join("")||"<li>—</li>"}</ul>
   ${v.palette_hex.length?`<h4>🎨 Palette theo AI Vision</h4><div class="palette">${v.palette_hex.map(hx=>`<div class="swatch"><i style="background:${esc(hx)}"></i><small>${esc(hx)}</small></div>`).join("")}</div>`:""}
   <p class="hint">💡 Lời khuyên riêng của AI Vision cho từng bước đã được bơm vào mục <b>“🤖 AI Vision khuyên riêng cho ảnh này”</b> trong phần Vẽ từng bước bên dưới — hãy mở từng bước để đọc.</p>`;
  drawVisionBoxes();
}
$("#vRun").onclick=async()=>{
  if(!state.img){$("#vStatus").textContent="Hãy tải một ảnh lên trước đã.";return;}
  const c=vCfg(); $("#vProgress").hidden=false; $("#vStatus").textContent="";
  try{
    const res=await vFetch("/chat/completions",{method:"POST",body:JSON.stringify({
      model:c.model, temperature:0.2, max_tokens:2000,
      messages:[{role:"user",content:[{type:"text",text:VISION_PROMPT},{type:"image_url",image_url:{url:downscaledDataURL(state.img)}}]}]
    })});
    if(!res.ok) throw new Error(vErr(res.status,await res.text()));
    const j=await res.json(); const text=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;
    state.vision=parseVisionJSON(text);
    renderVision(state.vision);
    $("#vStatus").textContent=`✅ Phân tích sâu xong bằng model ${c.model}. Mở từng bước học bên dưới để xem lời khuyên riêng.`;
    if(!$("#ve-tung-buoc").hidden) showStep(state.step);
  }catch(e){ $("#vStatus").textContent="❌ Phân tích sâu thất bại: "+e.message; }
  finally{ $("#vProgress").hidden=true; }
};

/* ---------------- VẼ THẬT TỪNG NÉT — 4 GIAI ĐOẠN DẠY VẼ ----------------
   ① Dựng khối (khung bao + trục + khối 3D cơ bản cho từng vật, nét chì xanh nhẹ)
   ② Đi nét chính bám theo khối   ③ Xóa đường dựng bằng tẩy dẻo (còn bóng ma 15%)
   ④ Hoàn thiện: nét đậm + chi tiết. Nét được truy vết từ chính ảnh người dùng. */

function boxBlurGray(g,w,h,passes){
  let src=Float32Array.from(g), dst=new Float32Array(w*h);
  for(let pass=0;pass<passes;pass++){
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){ let s=0; for(let k=-2;k<=2;k++){ const nx=Math.max(0,Math.min(w-1,x+k)); s+=src[y*w+nx]; } dst[y*w+x]=s/5; }
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){ let s=0; for(let k=-2;k<=2;k++){ const ny=Math.max(0,Math.min(h-1,y+k)); s+=dst[ny*w+x]; } src[y*w+x]=s/5; }
  }
  return src;
}
function posterizeLevels(g,w,h,L){
  const lv=new Int16Array(w*h);
  for(let i=0;i<w*h;i++) lv[i]=Math.round(g[i]/255*(L-1));
  return lv;
}
function boundaryBin(lv,w,h){
  const bin=new Uint8Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){ const p=y*w+x;
    if((x<w-1&&lv[p]!==lv[p+1])||(y<h-1&&lv[p]!==lv[p+w])) bin[p]=1; }
  return bin;
}
function closeBin(bin,w,h){
  const dil=new Uint8Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){ if(!bin[y*w+x])continue;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<w&&ny<h) dil[ny*w+nx]=1; } }
  const out=new Uint8Array(w*h);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){ let ok=1;
    for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){ if(!dil[(y+dy)*w+x+dx]){ok=0;break;} }
    out[y*w+x]=ok; }
  return out;
}
function labelRegions(lv,w,h){
  const seen=new Uint8Array(w*h), regs=[], stack=[];
  for(let s=0;s<w*h;s++){
    if(seen[s]) continue;
    const level=lv[s]; let area=0,minX=w,minY=h,maxX=0,maxY=0;
    stack.length=0; stack.push(s); seen[s]=1;
    while(stack.length){ const cur=stack.pop(); area++; const cx=cur%w, cy=(cur/w)|0;
      if(cx<minX)minX=cx; if(cx>maxX)maxX=cx; if(cy<minY)minY=cy; if(cy>maxY)maxY=cy;
      if(cx>0&&!seen[cur-1]&&lv[cur-1]===level){seen[cur-1]=1;stack.push(cur-1);}
      if(cx<w-1&&!seen[cur+1]&&lv[cur+1]===level){seen[cur+1]=1;stack.push(cur+1);}
      if(cy>0&&!seen[cur-w]&&lv[cur-w]===level){seen[cur-w]=1;stack.push(cur-w);}
      if(cy<h-1&&!seen[cur+w]&&lv[cur+w]===level){seen[cur+w]=1;stack.push(cur+w);} }
    const bw=maxX-minX+1, bh=maxY-minY+1, fill=area/(bw*bh), aspect=bw/bh;
    regs.push({x:minX/w,y:minY/h,w:bw/w,h:bh/h,fill,area,
      kind: aspect<0.68 ? "cylinder" : (fill>=0.86 ? "box" : "ellipse")});
  }
  regs.sort((a,b)=>b.area-a.area);
  return regs;
}
function sobelBinary(gray,w,h){
  const mag=new Float32Array(w*h);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;
    const gx=-gray[p-w-1]-2*gray[p-1]-gray[p+w-1]+gray[p-w+1]+2*gray[p+1]+gray[p+w+1];
    const gy=-gray[p-w-1]-2*gray[p-w]-gray[p-w+1]+gray[p+w-1]+2*gray[p+w]+gray[p+w+1];
    mag[p]=Math.hypot(gx,gy);}
  // Adaptive threshold: aim for ~7% edge density so soft photos still get complete outlines
  const sample=[]; for(let i=0;i<w*h;i+=7) sample.push(mag[i]);
  sample.sort((a,b)=>a-b);
  let thr=sample[Math.floor(sample.length*0.93)]||110;
  thr=Math.max(50,Math.min(230,thr));
  let bin=new Uint8Array(w*h);
  for(let p=0;p<w*h;p++) if(mag[p]>thr) bin[p]=1;
  // Morphological closing (dilate then erode, 3x3) bridges 1-2px gaps in soft-photo edges
  const dil=new Uint8Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){ if(!bin[y*w+x])continue;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<w&&ny<h) dil[ny*w+nx]=1; } }
  const out=new Uint8Array(w*h);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){ let ok=1;
    for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){ if(!dil[(y+dy)*w+x+dx]){ok=0;break;} }
    out[y*w+x]=ok; }
  return out;
}
function tracePaths(bin,w,h){
  const visited=new Uint8Array(w*h), paths=[];
  const DIRS=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  for(let start=0;start<w*h;start++){
    if(!bin[start]||visited[start]) continue;
    const path=[start]; visited[start]=1; let cur=start, dir=0, guard=0, jumps=0;
    while(guard++<6000){
      let moved=false;
      for(let s=0;s<8;s++){
        const nd=(dir+7+s)%8;
        const nx=(cur%w)+DIRS[nd][0], ny=Math.floor(cur/w)+DIRS[nd][1];
        if(nx<0||ny<0||nx>=w||ny>=h) continue;
        const np=ny*w+nx;
        if(bin[np]&&!visited[np]){ visited[np]=1; path.push(np); cur=np; dir=nd; moved=true; break; }
      }
      if(!moved && jumps<4){
        // Gap bridging: hop to the nearest unvisited edge pixel within 3px and keep drawing the same stroke
        const cx=cur%w, cy=Math.floor(cur/w); let best=-1, bd=1e9;
        for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){ const nx=cx+dx, ny=cy+dy;
          if(nx<0||ny<0||nx>=w||ny>=h) continue; const np=ny*w+nx;
          if(bin[np]&&!visited[np]){ const dd=dx*dx+dy*dy; if(dd<bd){bd=dd;best=np;} } }
        if(best>=0){ visited[best]=1; path.push(best); cur=best; jumps++; moved=true; }
      }
      if(!moved) break;
    }
    if(path.length>=6){
      const pts=[];
      for(let i=0;i<path.length;i+=2) pts.push([ (path[i]%w)/w, Math.floor(path[i]/w)/h ]);
      const last=path[path.length-1]; pts.push([ (last%w)/w, Math.floor(last/w)/h ]);
      paths.push(pts);
    }
  }
  paths.sort((a,b)=>b.length-a.length);
  return paths;
}
const STC=$("#strokeCanvas"), STX=STC.getContext("2d"), SCC=$("#strokeCursor"), SCX=SCC.getContext("2d");
const S4={A:[],B:[],D:[],total:0,u:0,playing:false,raf:null,fit:null,ready:false,stage:-1};
/* Fixed teaching-time windows (share of the whole replay), independent of segment counts:
   construction always gets a real, watchable share of the timeline. */
const WIN={a:[0,0.22], b:[0.22,0.52], f:[0.52,0.62], d:[0.62,1]};
const STYLE_A={color:"rgba(70,95,140,.62)",width:1.7};
const STYLE_B={color:"rgba(97,85,71,.78)",width:1.8};
const STYLE_D={color:"rgba(38,31,25,.95)",width:2.1};
const STAGE_TIPS=[
 "① DỰNG KHỐI — Học: đo khung bao quanh chủ thể, kẻ trục chính, rồi ép MỖI vật về khối 3D gần nhất: hộp, trụ hoặc cầu (khung xanh xám). Nét ở bước này phải thật nhẹ — vì lát nữa ta sẽ xóa nó đi.",
 "② ĐI NÉT CHÍNH — Học: vẽ đường viền thật bám sát khối đã dựng. Khối cho bạn tỉ lệ và vị trí; nét chính cho hình dáng thật. Chưa thêm chi tiết, chưa nhấn đậm.",
 "③ XÓA ĐƯỜNG DỰNG — Học: dùng tẩy dẻo nhấc bớt chì: đường dựng không mất hẳn mà thành “bóng ma” rất mờ ~10%, đủ để nét chính không lạc đường nhưng không còn tranh chấp với nét thật.",
 "④ HOÀN THIỆN — Học: đi lại toàn bộ nét chính bằng nét đậm dứt khoát, rồi mới thêm các nét chi tiết nhỏ và chất liệu. Thứ tự này — khối → nét → xóa → hoàn thiện — là xương sống của mọi bài vẽ đúng phương pháp."];
function prepareStrokes(){
  if(!state.img||!state.analysis) return;
  $("#strokePhase").textContent="Đang dựng khối & truy vết nét…";
  const a=state.analysis;
  const {g,w,h}=grayArr(state.img,480);
  const blurred=boxBlurGray(g,w,h,2);
  let lv=posterizeLevels(blurred,w,h,7);
  let bin=closeBin(boundaryBin(lv,w,h),w,h);
  let paths=tracePaths(bin,w,h);
  let total=0; for(const p of paths) total+=p.length;
  if(total>11000){ // too much texture: coarser posterize -> cleaner, drawing-like lines
    lv=posterizeLevels(blurred,w,h,5);
    bin=closeBin(boundaryBin(lv,w,h),w,h);
    paths=tracePaths(bin,w,h); total=0; for(const p of paths) total+=p.length;
  }
  const kept=[]; { let acc2=0; for(const p of paths){ if(acc2>42000) break; kept.push(p); acc2+=p.length; } }
  paths=kept;
  const W=STC.width,H=STC.height, iw=state.img.naturalWidth||state.img.width, ih=state.img.naturalHeight||state.img.height;
  const s=Math.min(W/iw,H/ih), fw=iw*s, fh=ih*s, fx=(W-fw)/2, fy=(H-fh)/2;
  S4.fit={x:fx,y:fy,w:fw,h:fh};
  const X=u=>fx+u*fw, Y=v=>fy+v*fh;
  const segsOf=(pts,out)=>{ for(let i=1;i<pts.length;i++) out.push({x1:pts[i-1][0],y1:pts[i-1][1],x2:pts[i][0],y2:pts[i][1]}); };
  const rect=(x,y,w2,h2,out)=>segsOf([[x,y],[x+w2,y],[x+w2,y+h2],[x,y+h2],[x,y]],out);
  const ellipse=(cx,cy,rx,ry,out,n=44)=>{ const pts=[]; for(let i=0;i<=n;i++){const th=i/n*Math.PI*2; pts.push([cx+rx*Math.cos(th), cy+ry*Math.sin(th)]);} segsOf(pts,out); };
  const arc=(cx,cy,rx,ry,a0,a1,out,n=20)=>{ const pts=[]; for(let i=0;i<=n;i++){const th=a0+(a1-a0)*i/n; pts.push([cx+rx*Math.cos(th), cy+ry*Math.sin(th)]);} segsOf(pts,out); };
  S4.A=[];
  const bx=X(a.bbox.x), by=Y(a.bbox.y), bw=a.bbox.w*fw, bh=a.bbox.h*fh;
  rect(bx,by,bw,bh,S4.A);
  for(let i=1;i<3;i++){
    segsOf([[bx+bw*i/3,by],[bx+bw*i/3,by+bh]],S4.A);
    segsOf([[bx,by+bh*i/3],[bx+bw,by+bh*i/3]],S4.A); }
  const ccx=X(a.centroid.x), ccy=Y(a.centroid.y);
  segsOf([[ccx,by-bh*0.05],[ccx,by+bh*1.05]],S4.A);
  segsOf([[bx-bw*0.05,ccy],[bx+bw*1.05,ccy]],S4.A);
  let comps=(a.components||[]).filter(c=>c.w<=0.8&&c.h<=0.85);
  if(comps.length<2){
    // Tonal regions of the posterized image: only compact, object-like masses qualify.
    const regs=labelRegions(lv,w,h).filter(r=>r.fill>=0.45&&r.area>=w*h*0.008&&r.area<=w*h*0.30&&r.w<=0.65&&r.h<=0.65);
    comps=regs.slice(0,5).map(r=>({x:r.x,y:r.y,w:r.w,h:r.h,kind:r.kind}));
  }
  if(comps.length<1){
    // Last resort for a full-frame subject: ONE overall mass + anchor masses at detail peaks.
    comps=[{x:a.bbox.x+a.bbox.w*0.05, y:a.bbox.y+a.bbox.h*0.05, w:a.bbox.w*0.9, h:a.bbox.h*0.9, kind:"ellipse"}];
    const cell=36, gw=Math.ceil(w/cell), gh=Math.ceil(h/cell), dens=new Float32Array(gw*gh);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){ if(bin[y*w+x]) dens[Math.floor(y/cell)*gw+Math.floor(x/cell)]++; }
    for(let i=0;i<dens.length;i++) dens[i]/=cell*cell;
    const order=[...dens.keys()].sort((p1,p2)=>dens[p2]-dens[p1]), peaks=[];
    for(const ci of order){
      if(dens[ci]<0.10||peaks.length>=4) break;
      const cx=ci%gw, cy=Math.floor(ci/gw);
      if(peaks.some(pk=>Math.abs(pk[0]-cx)<3&&Math.abs(pk[1]-cy)<3)) continue;
      peaks.push([cx,cy]);
    }
    for(const [pcx,pcy] of peaks){
      const cxN=(pcx+0.5)*cell/w, cyN=(pcy+0.5)*cell/h;
      const rw=a.bbox.w*0.17, rh=a.bbox.h*0.17;
      comps.push({x:Math.max(0,cxN-rw/2), y:Math.max(0,cyN-rh/2), w:rw, h:rh, kind:"ellipse"});
    }
  }
  S4.compKinds=comps.map(c=>c.kind);
  for(const c of comps){
    const x=X(c.x), y=Y(c.y), w2=c.w*fw, h2=c.h*fh, cx=x+w2/2, cy=y+h2/2;
    if(c.kind==="ellipse"){ ellipse(cx,cy,w2/2,h2/2,S4.A); arc(cx,cy,w2/2,h2*0.28,0,Math.PI,S4.A); }
    else if(c.kind==="cylinder"){ segsOf([[x,y+h2*0.06],[x,y+h2]],S4.A); segsOf([[x+w2,y+h2*0.06],[x+w2,y+h2]],S4.A);
      ellipse(cx,y+h2*0.06,w2/2,h2*0.06,S4.A,32); arc(cx,y+h2,w2/2,h2*0.06,0,Math.PI,S4.A); }
    else { rect(x,y,w2,h2,S4.A); segsOf([[x,y+h2*0.18],[x+w2,y+h2*0.18]],S4.A); }
  }
  S4.B=[]; let acc=0;
  for(const p of paths){ if(acc>total*0.55) break; acc+=p.length;
    segsOf(p.map(pt=>[X(pt[0]),Y(pt[1])]),S4.B); }
  S4.D=[];
  for(const p of paths) segsOf(p.map(pt=>[X(pt[0]),Y(pt[1])]),S4.D);
  S4.total=S4.A.length+S4.B.length+S4.D.length;
  S4.u=0; S4.playing=false; S4.ready=true; S4.stage=-1;
  $("#strokePlay").textContent="▶ Vẽ theo 4 giai đoạn";
  renderS4(0);
}
function paintSegList(ctx,list,from,to,style){
  if(to<=from) return;
  ctx.strokeStyle=style.color; ctx.lineWidth=style.width; ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.beginPath();
  for(let i=from;i<to;i++){ const sg=list[i]; ctx.moveTo(sg.x1,sg.y1); ctx.lineTo(sg.x2,sg.y2); }
  ctx.stroke();
}
const clamp01=v=>Math.max(0,Math.min(1,v));
function stageOf(u){
  if(u<WIN.a[1]) return 0; if(u<WIN.b[1]) return 1; if(u<WIN.f[1]) return 2; if(u<1) return 3; return 4;
}
function renderS4(u){
  S4.u=u;
  const aN=Math.floor(S4.A.length*clamp01((u-WIN.a[0])/(WIN.a[1]-WIN.a[0])));
  const bN=Math.floor(S4.B.length*clamp01((u-WIN.b[0])/(WIN.b[1]-WIN.b[0])));
  const dN=Math.floor(S4.D.length*clamp01((u-WIN.d[0])/(WIN.d[1]-WIN.d[0])));
  const alphaA = u<=WIN.f[0] ? 1 : (u>=WIN.f[1] ? 0.10 : 1-0.90*((u-WIN.f[0])/(WIN.f[1]-WIN.f[0])));
  STX.fillStyle="#f7f3ea"; STX.fillRect(0,0,STC.width,STC.height);
  STX.save(); STX.globalAlpha=alphaA; paintSegList(STX,S4.A,0,aN,STYLE_A); STX.restore();
  paintSegList(STX,S4.B,0,bN,STYLE_B);
  paintSegList(STX,S4.D,0,dN,STYLE_D);
  const st=stageOf(u), pct=Math.round(u*100);
  $("#strokeScrub").value=Math.round(u*1000);
  $("#strokeStats").textContent=`${pct}% · ${S4.total} đoạn nét`;
  const chip=$("#strokePhase");
  if(!S4.ready) chip.textContent="Đang chuẩn bị…";
  else if(st===4) chip.textContent="✅ Hoàn thiện xong — bản nét cuối: khối đã xóa mờ, nét chính + chi tiết đã khóa";
  else chip.textContent=["📐 Giai đoạn 1/4 — Dựng khối","✏️ Giai đoạn 2/4 — Đi nét chính","🧽 Giai đoạn 3/4 — Xóa đường dựng (tẩy dẻo)","🖊️ Giai đoạn 4/4 — Hoàn thiện nét & chi tiết"][st];
  if(st!==S4.stage){ S4.stage=st; $("#strokeTip").textContent = st===4 ? STAGE_TIPS[3] : (STAGE_TIPS[st]||""); }
  let cur=null;
  if(S4.playing&&u>0&&u<1){
    if(st===0&&aN>0) cur=S4.A[aN-1]; else if(st===1&&bN>0) cur=S4.B[bN-1]; else if(st===3&&dN>0) cur=S4.D[dN-1];
  }
  if(cur) drawPencil(cur.x2,cur.y2); else SCX.clearRect(0,0,SCC.width,SCC.height);
}
function drawPencil(x,y){
  SCX.clearRect(0,0,SCC.width,SCC.height);
  if(!$("#strokePencil").checked) return;
  SCX.font="26px sans-serif"; SCX.save(); SCX.translate(x,y); SCX.rotate(-0.5); SCX.fillText("✏️",-4,-16); SCX.restore();
  SCX.fillStyle="rgba(229,49,112,.9)"; SCX.beginPath(); SCX.arc(x,y,3.2,0,7); SCX.fill();
}
function strokeTick(){
  if(!S4.playing) return;
  const speed=(+$("#strokeSpeed").value)/100;
  renderS4(Math.min(1, S4.u + speed/(30*60)));
  if(S4.u>=1){ S4.playing=false; $("#strokePlay").textContent="▶ Vẽ lại"; SCX.clearRect(0,0,SCC.width,SCC.height); return; }
  S4.raf=requestAnimationFrame(strokeTick);
}
$("#strokePlay").onclick=()=>{
  if(!S4.ready) return;
  if(S4.playing){ S4.playing=false; cancelAnimationFrame(S4.raf); $("#strokePlay").textContent="▶ Vẽ tiếp"; renderS4(S4.u); return; }
  if(S4.u>=1) renderS4(0);
  S4.playing=true; $("#strokePlay").textContent="⏸ Tạm dừng"; S4.raf=requestAnimationFrame(strokeTick);
};
$("#strokeRestart").onclick=()=>{ if(!S4.ready)return; S4.playing=false; cancelAnimationFrame(S4.raf); renderS4(0); $("#strokePlay").textContent="▶ Vẽ theo 4 giai đoạn"; };
$("#strokeSpeed").oninput=e=>{ $("#strokeSpeedVal").textContent=((+e.target.value)/100).toFixed(2).replace(/\.?0+$/,"")+"×"; };
$("#strokeScrub").oninput=e=>{ if(!S4.ready)return; S4.playing=false; cancelAnimationFrame(S4.raf);
  const u=(+e.target.value)/1000;
  $("#strokePlay").textContent = u>=1 ? "▶ Vẽ lại" : "▶ Vẽ tiếp"; renderS4(u); };
$("#strokePencil").onchange=()=>renderS4(S4.u);
$("#strokeDownload").onclick=()=>{ if(!S4.ready)return;
  const c=makeCanvas(STC.width,STC.height), x=c.getContext("2d");
  x.fillStyle="#f7f3ea"; x.fillRect(0,0,c.width,c.height);
  x.save(); x.globalAlpha=0.10; paintSegList(x,S4.A,0,S4.A.length,STYLE_A); x.restore();
  paintSegList(x,S4.D,0,S4.D.length,STYLE_D);
  const a=document.createElement("a"); a.download="ban-net-4-giai-doan.png"; a.href=c.toDataURL("image/png"); a.click(); };
