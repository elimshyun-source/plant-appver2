# 식물 목록

## 이 파일의 역할
서비스에서 고를 수 있는 식물과, 식물별 관리 유형을 적는다.
식물마다 해결책을 따로 쓰지 않고, 비슷하게 키우는 식물끼리 **관리 유형**으로 묶어서 관리한다.

## 쓰는 법
- 식물은 관리 유형을 하나 가진다.
- 모든 항목에는 상태를 표시한다. **[확인됨]**은 내가 확인한 것, **[초안]**은 아직 확인하지 않은 것이다.
- 해결책이 준비되지 않은 식물("잎 증상 해결책" 칸이 "없음")은 식물 등록 목록에 보여주지 않는다.
- 처음에는 5종으로 시작하고, 잘 돌아가면 늘린다.

## 관리 유형
| 유형 | 특징 | 상태 |
|---|---|---|
| 촉촉함을 좋아하는 식물 | 흙이 너무 마르지 않게 관리하는 식물 | [확인됨] |
| 그늘에서도 괜찮은 식물 | 밝은 곳을 좋아하지만 햇빛이 적은 곳에도 적응하는 식물 | [확인됨] |
| 햇빛을 많이 좋아하는 식물 | 햇빛이 잘 드는 창가에 두어야 하는 식물 | [확인됨] |

## 식물 목록
| 식물 이름 | 관리 유형 | 잎 증상 해결책 | 상태 |
|---|---|---|---|
| 스킨답서스 | 그늘에서도 괜찮은 식물 | 있음 | [확인됨] |
| 스파티필럼 | 촉촉함을 좋아하는 식물 | 있음 | [확인됨] |
| 올리브나무 | 햇빛을 많이 좋아하는 식물 | 있음 | [확인됨] |
| 몬스테라 | 그늘에서도 괜찮은 식물 (유형은 11/20 확정. 근거는 아래 "식물별 관리 정보" 참고) | 있음 | [확인됨] |
| 로즈마리 | 햇빛을 많이 좋아하는 식물 | 있음 (일부 해결책은 로즈마리를 뺀다. solutions.md 참고) | [확인됨] |

## 식물 그림 (11/26 받은 그림)
홈 창문 그림 속 빨간 화분과 결과 화면 화분 위에 올리는 식물 그림이다. 그림은 식물 종류와 상관없다.
- **등록할 때 아래 그림 중 하나를 랜덤으로 골라 식물에 저장한다.** 한 번 정하면 바뀌지 않는다(새로고침해도 같은 그림). 그림 번호가 없는 예전 식물은 처음 볼 때 한 번 정한다.
- 크기: "너비"는 화분 테두리(외곽선 포함) 너비에 대한 비율. 높이는 그림 비율대로.
- 위치: 그림 아랫면을 화분 테두리 윗면(외곽선 가운데)에 맞추고, 가로 가운데에 둔다.
- 앱은 이 표를 읽는다.

| 그림 | 파일 | 너비 |
|---|---|---|
| 1 | plant-1.png | 0.8 |
| 2 | plant-2.png | 1.0 |
| 3 | plant-3.png | 0.9 |

예전 그림(plant-rosemary / olive / pothos / monstera / peacelily.png, 식물 종류별)은 11/26부터 쓰지 않는다.

## 참고
- 해결책은 대부분 식물 유형별로 나뉘지 않고 "모든 식물"에 같이 적용된다. 식물별로 다르게 안내해야 하는 경우만 해결책 안에 "대상 식물"을 따로 적는다.
- 로즈마리는 물이 잘 빠지는 흙에서 흙이 어느 정도 마른 뒤에 물을 주고, 햇빛을 많이 받아야 하는 식물이라서 다른 식물과 다르게 안내해야 하는 해결책이 있다.

## 식물별 관리 정보 (11/19 조사)
식물마다 다르게 안내해야 하는 내용을 자료에서 찾아 적었다. solutions.md의 "식물별 안내"는 이 표에서 가져온다.
- 숫자(몇 인치, 몇 시간)는 자료마다 달라서 서비스 문구에는 쓰지 않는다. 자료가 없는 칸은 "자료 확인 못함"으로 적었다.
- 대학 Extension·식물원 자료를 먼저 보았고, 없는 부분은 원예 사이트로 채웠다. 모든 칸이 [확인됨]이다.

| 항목 | 스킨답서스 | 스파티필럼 | 올리브나무 | 몬스테라 | 로즈마리 |
|---|---|---|---|---|---|
| 물 주는 때 | 윗부분 흙이 마르면. 과습이 더 위험. 완전히 말려도 된다는 자료는 클렘슨 하나뿐 | 윗부분 흙이 마르면. 처지면 물 부족일 수 있고 물을 주면 보통 회복. 과습 쪽이 더 위험하다는 자료와 물 부족 쪽이 더 흔하다는 자료가 갈림 | 흙이 많이 마른 뒤. 계속 젖은 뿌리를 싫어함 | 윗부분 흙이 마르면. 과습에 더 민감. 완전히 말리지는 않음 | 윗흙이 마르면. 과습이 가장 위험하지만 너무 마르면 잎이 떨어짐. 촉촉하게 유지하라는 자료도 있어 갈림 |
| 물 주는 방법 | 충분히 주고 받침에 고인 물 비우기. "천천히 나눠서"는 자료 확인 못함 | 구멍으로 물이 나올 때까지 충분히. 받침 물 비우기. 수돗물은 받아 두었다 쓰라는 자료 있음 | 구멍으로 물이 나올 때까지 충분히 주는 쪽이 대부분. 화분이 물에 잠기지 않게 하기 | 구멍으로 물이 나올 때까지 충분히. 받침 물 비우기 | 배수가 좋은 화분에서 충분히. 위에서 잎에 붓지 말고 밑동에 주기. "구멍으로 나올 때까지"는 자료 확인 못함 |
| 햇빛 | 밝은 간접광. 직사광선은 잎이 탐. 약한 빛도 견디지만 무늬가 옅어짐 | 밝은 간접광. 직사광선은 잎이 탐. 약한 빛도 견디지만 꽃이 줄어듦 | 직사광선이 필요함 (남향 창가). 부족하면 잎이 떨어질 수 있음. 보조 조명을 권하는 자료 많음 | 밝은 간접광, 직사광선은 피하는 쪽이 다수. 너무 어두우면 줄기가 웃자라고 잎에 구멍이 안 생김 | 직사광선이 필요함 (남향 창가). 약한 빛이 실내 월동 실패의 흔한 원인 |
| 아래쪽 오래된 노란 잎 | 자연스러운 현상. 떼어내도 됨 | 자연스럽다는 자료는 하나뿐, 대부분 물 부족·약한 빛·영양 점검을 권함. 떼어내도 됨 (줄기 밑동에서) | 봄에 새 잎이 나면서 오래된 잎이 떨어질 수 있음. 떼어내는 방법은 자료 확인 못함 | 새 잎이 건강하면 가장 오래된 한두 장은 정상. 완전히 노래진 뒤에 떼기 | 로즈마리 전용 자료 확인 못함 (일반 실내식물 자료: 성숙한 식물은 아래 잎 한 장씩 노래질 수 있음) |
| 건조한 공기 | 어느 정도 견딤. 낮은 습도가 잎 끝 갈변과 관련될 수 있음. 가습기가 가장 효과적, 분무는 의견이 갈림 | 낮은 습도가 잎 끝 갈변 원인이라는 자료가 많음. 가습기·자갈 받침 권함. 물의 염소·불소와 비료 과다도 원인 | 건조한 공기를 견딤. 분무·가습은 권하지 않는 자료와 권하는 자료가 갈림 | 낮은 습도가 갈변 원인이라는 자료가 많음. 가습기와 식물 모으기는 도움. 분무는 의견이 갈림 | 난방된 건조한 공기에 잎이 마를 수 있음. 습도를 올리라는 자료와 흰가루병을 조심하라는 자료가 갈림. 공기 순환은 모두 좋다고 함 |
| 환경 변화 | 찬바람·급한 온도 변화에 민감. 에어컨 바람, 난방 송풍구 피하기 | 찬바람·난방 송풍구 피하기. 장소 이동 대처는 자료 확인 못함 | 찬바람 피하기. 장소를 옮기면 잎이 떨어질 수 있고 환경에 맞으면 다시 자람 | 찬바람을 몹시 싫어함. 새 빛 환경에는 서서히 적응시키기 | 옮겨심기를 잘 못 견딤. 난방기·외풍 피하기 |
| 자료 수준 | 대학 Extension 위주 (위스콘신, 클렘슨, 플로리다, eXtension) | 대학 Extension + RHS | 대학 자료 거의 없음 (Ask Extension 1건, RHS). 대부분 원예 사이트 | 대학 3곳(UConn, 펜실베이니아주립, 위스콘신) + RHS | 대학 Extension 다수 (위스콘신, 펜실베이니아주립, NDSU, 일리노이) |

관리 유형 판단 (몬스테라): 겉흙이 마르면 물을 주고 과습에 더 민감해서 "촉촉함" 유형이 아니고, 직사광선을 피하라는 자료가 많아서 "햇빛을 많이 좋아함" 유형도 아니다. 다만 빛이 너무 약하면 웃자라고 잎에 구멍이 안 생겨서, 어두운 곳에서 잘 자란다는 뜻은 아니다. 그래서 "그늘에서도 괜찮은 식물"로 분류한다. (11/20 확정)

### 식물별 확인 자료
- 스킨답서스: [위스콘신대 Extension](https://hort.extension.wisc.edu/articles/pothos-epipremmum-aureum/) / [클렘슨대 Extension](https://hgic.clemson.edu/factsheet/how-to-grow-pothos-indoors-epipremnum-spp-care-cultivars-and-common-problems/) / [eXtension 질의응답](https://ask.extension.org/kb/faq.php?id=855914) / [플로리다대 UF/IFAS(상업 재배 기준)](https://ask.ifas.ufl.edu/publication/EP151/pdf) / [Healthy Houseplants](https://www.healthyhouseplants.com/?p=15916)
- 스파티필럼: [RHS](https://www.rhs.org.uk/plants/peace-lilies/how-to-grow-peace-lilies) / [클렘슨대 Extension](https://hgic.clemson.edu/factsheet/peace-lily/) / [NC State Extension](https://plants.ces.ncsu.edu/plants/spathiphyllum) / [사우스다코타주립대 Extension](https://extension.sdstate.edu/care-peace-lilies) / [사우스다코타주립대 Extension(요령)](https://extension.sdstate.edu/peace-lily-houseplant-how) / [조지아대 Extension](https://site.extension.uga.edu/fannin-gilmer/2020/12/houseplant-woes/) / [Ask Extension](https://ask.extension.org/kb/faq.php?id=441824) / [Gardeners' World](https://www.gardenersworld.com/how-to/grow-plants/how-to-grow-peace-lily/) / [Hortmag](https://www.hortmag.com/container-gardening/peace-lily-care) / [Joy Us Garden](https://www.joyusgarden.com/peace-lily-care/)
- 올리브나무: [Ask Extension](https://ask.extension.org/kb/faq.php?id=609668) / [RHS](https://www.rhs.org.uk/plants/olives/how-to-grow-olives) / [Epic Gardening](https://www.epicgardening.com/?p=239864) / [Bob Vila](https://www.bobvila.com/articles/how-to-grow-an-olive-tree-indoors) / [Lively Root](https://livelyroot.com/blogs/plant-care/olive-tree-care) / [UK Houseplants](https://www.ukhouseplants.com/plants/olive-trees) / [Homes & Gardens](https://www.homesandgardens.com/gardens/can-you-grow-an-olive-tree-indoors) / [Leon & George](https://blog.leonandgeorge.com/posts/olive-tree-yellow-leaves)
- 몬스테라: [UConn](https://homegarden.cahnr.uconn.edu/factsheets/monstera-deliciosa) / [펜실베이니아주립대 Extension](https://extension.psu.edu/monstera-as-a-houseplant) / [위스콘신대 마스터가드너(PDF)](https://mastergardener.extension.wisc.edu/files/2015/12/Monstera_deliciosa.pdf) / [RHS](https://www.rhs.org.uk/plants/11192/monstera-deliciosa-f/details) / [Epic Gardening](https://www.epicgardening.com/monstera-deliciosa/) / [PlantFix](https://plantfix.org/plants/monstera) / [House Plant Journal](https://www.houseplantjournal.com/?p=2417)
- 로즈마리: [위스콘신 Kenosha Extension](https://kenosha.extension.wisc.edu/2020/12/13/holiday-rosemary/) / [위스콘신대 Extension](https://hort.extension.wisc.edu/articles/rosemary-rosemarinus-officinalis/) / [펜실베이니아주립대 Extension](https://extension.psu.edu/herb-garden-plants-rosemary) / [NDSU Extension](https://www.ag.ndsu.edu/news/columns/dakota-gardener/dakota-gardener-the-houseplant-you-didn2019t-know-you-needed-2014-growing-rosemary-indoors) / [일리노이대 Extension](https://extension.illinois.edu/blogs/rhonda-ferrees-ilriverhort/2017-12-03-give-rosemary-sign-love-and-remembrance) / [Ask Extension](https://ask.extension.org/kb/faq.php?id=291164) / [미주리 식물원(실내 흰가루병)](https://www.missouribotanicalgarden.org/gardens-gardening/your-garden/help-for-the-home-gardener/advice-tips-resources/insects-pests-and-problems/diseases/powdery-mildew/powdery-mildew-indoors) / [Epic Gardening](https://www.epicgardening.com/growing-rosemary-indoors/) / [Healthy Houseplants](https://www.healthyhouseplants.com/?p=16826)
