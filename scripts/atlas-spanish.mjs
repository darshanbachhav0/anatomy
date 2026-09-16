// Deterministic anatomical nomenclature for the shipped BodyParts3D catalog.
// No student data or runtime translation service is involved.
const parse = text => Object.fromEntries(text.trim().split('\n').map(line => line.split('|')));
const terms = parse(`
third ventricle|tercer ventrículo cerebral
fourth ventricle|cuarto ventrículo cerebral
lateral ventricle|ventrículo lateral cerebral
interventricular foramen|agujero interventricular cerebral
arterial tree organ|árbol arterial
venous tree organ|árbol venoso
pulmonary venous tree organ|árbol venoso pulmonar
neural tree organ|árbol nervioso
vascular tree organ|árbol vascular
coronary sinus tree|árbol del seno coronario
portal vein|vena porta
hepatic portal vein|vena porta hepática
caudate lobe branch|rama del lóbulo caudado
caudate lobe tributary|afluente del lóbulo caudado
upper lobe part|parte del lóbulo superior
middle lobe part|parte del lóbulo medio
lower lobe part|parte del lóbulo inferior
apparatus|aparato
arteries proper|arterias propias
artery proper|arteria propia
bile duct|conducto biliar
body cavity content|contenido de la cavidad corporal
body compartment|compartimento corporal
body part|parte corporal
body proper|cuerpo propiamente dicho
body wall|pared corporal
boundary entity|entidad de límite
bronchus proper|bronquio propiamente dicho
canaliculus|canalículo
cartilage organ component|componente cartilaginoso
cell part cluster|conjunto de partes celulares
chest wall|pared torácica
choroid plexus|plexo coroideo
colliculus|colículo
compartment space|espacio de un compartimento
complex|complejo
concha|cornete
conduit space|espacio de un conducto
constrictor muscle|músculo constrictor
conus artery|arteria del cono
conus branch|rama del cono
disk|disco
duct tree|árbol de conductos
foramen|agujero
gray matter component|componente de sustancia gris
incisure|incisura
inflow part|porción de entrada
lake|lago
ligament organ component|componente ligamentoso
liver (in-vivo)|hígado (en el organismo vivo)
lobe branch|rama lobar
lobe part|parte de un lóbulo
lobe tributary|afluente lobar
membrane organ component|componente membranoso
muscle layer|capa muscular
nerve trunk|tronco nervioso
network|red
organ cavity|cavidad de un órgano
organ cavity subdivision|subdivisión de la cavidad de un órgano
organ chamber|cámara de un órgano
organ component|componente de un órgano
organ component cluster|conjunto de componentes de un órgano
organ component gland|glándula que forma parte de un órgano
organ component layer|capa de un órgano
organ part|parte de un órgano
organ part cluster|conjunto de partes de un órgano
organ region|región de un órgano
organ segment|segmento de un órgano
organ zone|zona de un órgano
outflow part|porción de salida
plate|placa
premolar tooth|diente premolar
secondary canine tooth|diente canino permanente
secondary incisor tooth|diente incisivo permanente
secondary molar tooth|diente molar permanente
secondary premolar tooth|diente premolar permanente
serratus posterior inferior|músculo serrato posterior inferior
serratus posterior superior|músculo serrato posterior superior
sinus tree|árbol del seno
skeleton (in vivo)|esqueleto (en el organismo vivo)
sphincter|esfínter
structure|estructura
subdivisionof autonomic nervous system|subdivisión del sistema nervioso autónomo
tissue part|parte de un tejido
tree organ|órgano de estructura ramificada
ventricle proper|ventrículo propiamente dicho
abdomen|abdomen
abdomen proper|abdomen propiamente dicho
abductor digiti minimi|músculo abductor del dedo meñique
abductor hallucis|músculo abductor del dedo gordo del pie
abductor pollicis brevis|músculo abductor corto del pulgar
abductor pollicis longus|músculo abductor largo del pulgar
adductor brevis|músculo aductor corto
adductor hallucis|músculo aductor del dedo gordo del pie
adductor longus|músculo aductor largo
adductor magnus|músculo aductor mayor
adductor minimus|músculo aductor mínimo
adductor pollicis|músculo aductor del pulgar
adrenal gland|glándula suprarrenal
amygdala|amígdala cerebral
anastomosis|anastomosis
anconeus|músculo ancóneo
aorta|aorta
appendix|apéndice
arch|arco
archicortex|arquicorteza
arm|brazo
arteria princeps pollicis|arteria principal del pulgar
arteria radialis indicis|arteria radial del índice
artery|arteria
arteries|arterias
aryepiglotticus|músculo ariepiglótico
atlas|atlas
atrium|aurícula
axis|axis
back|espalda
basicranium|base del cráneo
biceps brachii|músculo bíceps braquial
biceps femoris|músculo bíceps femoral
big toe|dedo gordo del pie
body|cuerpo
bone|hueso
bone organ|hueso
brachialis|músculo braquial
brachioradialis|músculo braquiorradial
brachium|brazo
brain|encéfalo
brainstem|tronco encefálico
branch|rama
branches|ramas
bronchus|bronquio
calcaneus|calcáneo
canal|conducto
canine tooth|diente canino
capitate|hueso grande del carpo
capsule|cápsula
cartilage|cartílago
cartilage organ|cartílago
cavity|cavidad
cecum|ciego
cerebellum|cerebelo
cerebral aqueduct|acueducto cerebral
cerebral arterial circle|círculo arterial cerebral
cervical intertransversarii|músculos intertransversos cervicales
chamber|cámara
check ligament|ligamento de contención
cheek|mejilla
chest|tórax
choroid|coroides
ciliary body|cuerpo ciliar
clavicle|clavícula
cluster|conjunto
clusters|conjuntos
coccygeus|músculo coccígeo
colon|colon
commissure|comisura
compartment|compartimento
component|componente
constrictor|músculo constrictor
content|contenido
continuity|continuidad
conus elasticus|cono elástico
coracobrachialis|músculo coracobraquial
cornea|córnea
corona ciliaris|corona ciliar
coronary sinus|seno coronario
corpus callosum|cuerpo calloso
corpus cavernosum|cuerpo cavernoso
corpus spongiosum|cuerpo esponjoso
cortex|corteza
cricothyroid|músculo cricotiroideo
crico-arytenoid|músculo cricoaritenoideo
cuboid bone|hueso cuboides
cuneiform bone|hueso cuneiforme
cusp|valva
decussation|decusación
deferent duct|conducto deferente
deltoid|músculo deltoides
diaphragm|diafragma
diencephalon|diencéfalo
digastric|músculo digástrico
division|división
dorsal interossei|músculos interóseos dorsales
dorsalis pedis artery|arteria dorsal del pie
dorsum|dorso
duct|conducto
duodenum|duodeno
dura mater|duramadre
ear|oído
entity|entidad
epidermis|epidermis
epididymis|epidídimo
epiglottis|epiglotis
epithalamus|epitálamo
epithelium|epitelio
esophagus|esófago
ethmoid|hueso etmoides
extensor carpi radialis brevis|músculo extensor radial corto del carpo
extensor carpi radialis longus|músculo extensor radial largo del carpo
extensor carpi ulnaris|músculo extensor cubital del carpo
extensor digiti minimi|músculo extensor del dedo meñique
extensor digitorum|músculo extensor de los dedos
extensor digitorum longus|músculo extensor largo de los dedos
extensor hallucis brevis|músculo extensor corto del dedo gordo del pie
extensor hallucis longus|músculo extensor largo del dedo gordo del pie
extensor indicis|músculo extensor del índice
extensor pollicis brevis|músculo extensor corto del pulgar
extensor pollicis longus|músculo extensor largo del pulgar
external oblique|músculo oblicuo externo
eye|ojo
eyeball|globo ocular
eyebrow|ceja
eyelid|párpado
face|cara
fascia|fascia
fascia lata|fascia lata
femur|fémur
fibula|peroné
fibularis brevis|músculo peroneo corto
fibularis longus|músculo peroneo largo
fibularis tertius|músculo peroneo tercero
finger|dedo de la mano
flexor accessorius|músculo cuadrado plantar
flexor carpi radialis|músculo flexor radial del carpo
flexor carpi ulnaris|músculo flexor cubital del carpo
flexor digiti minimi brevis|músculo flexor corto del dedo meñique
flexor digitorum brevis|músculo flexor corto de los dedos
flexor digitorum longus|músculo flexor largo de los dedos
flexor digitorum profundus|músculo flexor profundo de los dedos
flexor digitorum superficialis|músculo flexor superficial de los dedos
flexor hallucis brevis|músculo flexor corto del dedo gordo del pie
flexor hallucis longus|músculo flexor largo del dedo gordo del pie
flexor pollicis brevis|músculo flexor corto del pulgar
flexor pollicis longus|músculo flexor largo del pulgar
foot|pie
foot proper|pie propiamente dicho
forearm|antebrazo
forebrain|prosencéfalo
fornix|fórnix
fossa|fosa
gallbladder|vesícula biliar
ganglion|ganglio
gastrocnemius|músculo gastrocnemio
gemellus|músculo gemelo
gemellus inferior|músculo gemelo inferior
gemellus superior|músculo gemelo superior
genioglossus|músculo geniogloso
geniohyoid|músculo genihioideo
gingiva|encía
gland|glándula
glans penis|glande del pene
globus pallidus|globo pálido
gluteus maximus|músculo glúteo mayor
gluteus medius|músculo glúteo medio
gluteus minimus|músculo glúteo menor
gracilis|músculo grácil
gray matter|sustancia gris
gyrus|giro
habenula|habénula
hair|vello
hairs|vello
hamate|hueso ganchoso
hand|mano
hand proper|mano propiamente dicha
head|cabeza
head proper|cabeza propiamente dicha
heart|corazón
hemiliver|hemihígado
hemisphere|hemisferio
hindbrain|rombencéfalo
hip|cadera
hip bone|hueso coxal
hippocampal formation|formación hipocampal
hippocampus|hipocampo
humerus|húmero
human body|cuerpo humano
hyoglossus|músculo hiogloso
hyoid bone|hueso hioides
hypothalamus|hipotálamo
ileum|íleon
iliacus|músculo ilíaco
iliococcygeus|músculo iliococcígeo
iliocostalis|músculo iliocostal
iliocostalis cervicis|músculo iliocostal cervical
iliocostalis lumborum|músculo iliocostal lumbar
iliocostalis thoracis|músculo iliocostal torácico
incisor tooth|diente incisivo
index finger|dedo índice
inferior oblique|músculo oblicuo inferior
inferior rectus|músculo recto inferior
infraspinatus|músculo infraespinoso
infraspinatus muscle|músculo infraespinoso
insula|ínsula
integument|tegumento
interosseous|músculo interóseo
interspinales cervicis|músculos interespinosos cervicales
interspinales lumborum|músculos interespinosos lumbares
interspinalis thoracis|músculo interespinoso torácico
interspinalis muscle|músculo interespinoso
intertransversarius|músculo intertransverso
intertransversarius muscle|músculo intertransverso
intervertebral disk|disco intervertebral
iris|iris
jaw|mandíbula
jejunum|yeyuno
junction|unión
kidney|riñón
knee|rodilla
lamina|lámina
lamina terminalis|lámina terminal
large intestine|intestino grueso
laryngopharynx|laringofaringe
larynx|laringe
lateral rectus|músculo recto lateral
layer|capa
leaf|hoja
leaflet|valva
leg|pierna
lens|cristalino
levator ani|músculo elevador del ano
levator palpebrae superioris|músculo elevador del párpado superior
levator scapulae|músculo elevador de la escápula
levator veli palatini|músculo elevador del velo del paladar
levatores costarum breves|músculos elevadores cortos de las costillas
levatores costarum longi|músculos elevadores largos de las costillas
ligament|ligamento
ligament organ|ligamento
limb|miembro
line|línea
linea alba|línea alba
lip|labio
little finger|dedo meñique de la mano
little toe|dedo meñique del pie
liver|hígado
lobe|lóbulo
lobule|lobulillo
longissimus|músculo longísimo
longissimus capitis|músculo longísimo de la cabeza
longissimus cervicis|músculo longísimo del cuello
longissimus thoracis|músculo longísimo torácico
longus capitis|músculo largo de la cabeza
longus colli|músculo largo del cuello
lower jaw|mandíbula
lumbrical|músculo lumbrical
lumbricals|músculos lumbricales
lunate|hueso semilunar
lung|pulmón
mandible|mandíbula
manubrium|manubrio
maxilla|maxilar
medial rectus|músculo recto medial
mediastinum|mediastino
medulla oblongata|bulbo raquídeo
membrane|membrana
membrane organ|membrana
mesentery|mesenterio
mesoappendix|mesoapéndice
metencephalon|metencéfalo
midbrain|mesencéfalo
midbrain tectum|techo del mesencéfalo
middle finger|dedo medio
molar tooth|diente molar
mons pubis|monte del pubis
mouth|boca
muscle|músculo
muscle organ|músculo
musculature|musculatura
mylohyoid|músculo milohioideo
myocardium|miocardio
neck|cuello
nerve|nervio
neuraxis|neuroeje
neurocranium|neurocráneo
nose|nariz
nucleus|núcleo
oblique arytenoid|músculo aritenoideo oblicuo
obliquus capitis inferior|músculo oblicuo inferior de la cabeza
obliquus capitis superior|músculo oblicuo superior de la cabeza
obturator externus|músculo obturador externo
obturator internus|músculo obturador interno
omohyoid|músculo omohioideo
opponens digiti minimi|músculo oponente del dedo meñique
opponens pollicis|músculo oponente del pulgar
optic chiasm|quiasma óptico
orbit|órbita
organ|órgano
organs|órganos
organ parts|partes de órgano
organ regions|regiones de órgano
palate|paladar
palatopharyngeus|músculo palatofaríngeo
palmar interossei|músculos interóseos palmares
palmaris longus|músculo palmar largo
pancreas|páncreas
parenchyma|parénquima
part|parte
parts|partes
patella|rótula
pectineus|músculo pectíneo
pectoral girdle|cintura escapular
pectoralis major|músculo pectoral mayor
pectoralis minor|músculo pectoral menor
peduncle|pedúnculo
pelvic girdle|cintura pélvica
pelvis|pelvis
penis|pene
perineum|periné
peritoneum|peritoneo
phalanx|falange
pharynx|faringe
pineal body|glándula pineal
piriformis|músculo piriforme
pisiform|hueso pisiforme
pituitary gland|hipófisis
plantar interosseous|músculo interóseo plantar
plantaris|músculo plantar
platysma|músculo platisma
plexus|plexo
pons|puente
popliteus|músculo poplíteo
portion|porción
process|apófisis
pronator quadratus|músculo pronador cuadrado
pronator teres|músculo pronador redondo
prostate|próstata
psoas major|músculo psoas mayor
pubococcygeus|músculo pubococcígeo
puborectalis|músculo puborrectal
putamen|putamen
quadratus femoris|músculo cuadrado femoral
quadriceps femoris|músculo cuádriceps femoral
radius|radio
raphe|rafe
rectum|recto
rectus capitis anterior|músculo recto anterior de la cabeza
rectus capitis lateralis|músculo recto lateral de la cabeza
rectus capitis posterior major|músculo recto posterior mayor de la cabeza
rectus capitis posterior minor|músculo recto posterior menor de la cabeza
rectus femoris|músculo recto femoral
region|región
retina|retina
retinaculum|retináculo
rhomboid major|músculo romboides mayor
rhomboid minor|músculo romboides menor
rib|costilla
rib cage|caja torácica
ring|anillo
ring finger|dedo anular
root|raíz
rotator|músculo rotador
sac|saco
sacrum|sacro
salpingopharyngeus|músculo salpingofaríngeo
sartorius|músculo sartorio
scalenus anterior|músculo escaleno anterior
scalenus medius|músculo escaleno medio
scalenus posterior|músculo escaleno posterior
scaphoid|hueso escafoides
scapula|escápula
sclera|esclerótica
sector|sector
segment|segmento
semimembranosus|músculo semimembranoso
seminal vesicle|vesícula seminal
semispinalis|músculo semiespinoso
semispinalis capitis|músculo semiespinoso de la cabeza
semispinalis cervicis|músculo semiespinoso del cuello
semispinalis thoracis|músculo semiespinoso torácico
semitendinosus|músculo semitendinoso
septum|tabique
serratus anterior|músculo serrato anterior
serratus posterior|músculo serrato posterior
set|conjunto
shoulder|hombro
side|lado
skeleton|esqueleto
skin|piel
skin appendage|anexo cutáneo
skull|cráneo
small intestine|intestino delgado
soleus|músculo sóleo
space|espacio
spinal cord|médula espinal
spinalis|músculo espinoso
spinalis thoracis|músculo espinoso torácico
spleen|bazo
splenius|músculo esplenio
splenius capitis|músculo esplenio de la cabeza
splenius cervicis|músculo esplenio del cuello
sternocleidomastoid|músculo esternocleidomastoideo
sternohyoid|músculo esternohioideo
sternothyroid|músculo esternotiroideo
sternum|esternón
stomach|estómago
stria|estría
stria medullaris|estría medular
stria terminalis|estría terminal
stylohyoid|músculo estilohioideo
stylopharyngeus|músculo estilofaríngeo
subaortic curtain|cortina subaórtica
subclavius|músculo subclavio
subcortex|subcorteza
subdivision|subdivisión
subscapularis|músculo subescapular
subsector|subsector
sulcus|surco
superior oblique|músculo oblicuo superior
superior rectus|músculo recto superior
supinator|músculo supinador
supraspinatus|músculo supraespinoso
symphysis|sínfisis
system|sistema
taenia coli|tenia del colon
taenia libera|tenia libre
taenia mesocolica|tenia mesocólica
taenia omentalis|tenia omental
talus|astrágalo
telencephalon|telencéfalo
tendon|tendón
tensor fasciae latae|músculo tensor de la fascia lata
tensor veli palatini|músculo tensor del velo del paladar
tentorium cerebelli|tienda del cerebelo
teres major|músculo redondo mayor
teres minor|músculo redondo menor
testis|testículo
thalamus|tálamo
thigh|muslo
thorax|tórax
thumb|pulgar
thymus|timo
thyro-arytenoid|músculo tiroaritenoideo
thyrohyoid|músculo tirohioideo
tibia|tibia
tibialis anterior|músculo tibial anterior
tibialis posterior|músculo tibial posterior
tissue|tejido
toe|dedo del pie
tongue|lengua
tooth|diente
trachea|tráquea
tract|tracto
transverse arytenoid|músculo aritenoideo transverso
transverse mesocolon|mesocolon transverso
transversus thoracis|músculo transverso del tórax
trapezium|hueso trapecio
trapezius|músculo trapecio
trapezoid|hueso trapezoide
tree|árbol
tributary|afluente
triceps brachii|músculo tríceps braquial
triquetral|hueso piramidal
trochlea|tróclea
trunk|tronco
tuber cinereum|túber cinéreo
ulna|cúbito
upper jaw|maxilar
ureter|uréter
urethra|uretra
urinary bladder|vejiga urinaria
uvula|úvula
valve|válvula
vasculature|vasculatura
vastus intermedius|músculo vasto intermedio
vastus lateralis|músculo vasto lateral
vastus medialis|músculo vasto medial
vein|vena
veins|venas
vena cava|vena cava
ventricle|ventrículo
vertebra|vértebra
vertebrae|vértebras
vertebral column|columna vertebral
viscerocranium|viscerocráneo
vitreous body|cuerpo vítreo
vocalis|músculo vocal
vomer|vómer
wall|pared
white matter|sustancia blanca
wrist|muñeca
zone|zona
`);

// Adjectives are inflected against the head noun, not the last word of a name.
const adjectives = parse(`
alar|alar
antebrachial|antebraquial
collateral|colateral
cubital|cubital
epigastric|epigástrico
saphenous|safeno
vermian|del vermis
abdominal|abdominal
accessory|accesorio
acromial|acromial
alimentary|alimentario
anal|anal
anatomical|anatómico
angular|angular
anterior|anterior
antero-medial|anteromedial
anterolateral|anterolateral
aortic|aórtico
apical|apical
apicoposterior|apicoposterior
appendicular|apendicular
arcuate|arqueado
arterial|arterial
articular|articular
arytenoid|aritenoideo
ascending|ascendente
atypical|atípico
auriculotemporal|auriculotemporal
autonomic|autónomo
axial|axial
axillary|axilar
azygos|ácigos
basal|basal
basicranial|basicraneal
basilar|basilar
basilic|basílico
biliary|biliar
bony|óseo
brachial|braquial
brachiocephalic|braquiocefálico
bronchial|bronquial
bronchopulmonary|broncopulmonar
calcaneal|calcáneo
callosomarginal|callosomarginal
cardiac|cardíaco
cardinal|principal
cardiovascular|cardiovascular
carotid|carótido
carpal|carpiano
cartilaginous|cartilaginoso
caudal|caudal
caudate|caudado
cavernous|cavernoso
cavitated|cavitado
cecal|cecal
celiac|celíaco
coeliac|celíaco
central|central
cephalic|cefálico
cerebellar|cerebeloso
cerebral|cerebral
cervical|cervical
choroidal|coroideo
ciliary|ciliar
cingulate|cingulado
circumflex|circunflejo
circumventricular|circunventricular
clavicular|clavicular
colic|cólico
common|común
communicating|comunicante
connective|conjuntivo
coronary|coronario
corniculate|corniculado
corticomedullary|corticomedular
costal|costal
costocervical|costocervical
cranial|craneal
cricoid|cricoideo
cricothyroid|cricotiroideo
cuneiform|cuneiforme
cystic|cístico
deep|profundo
deltoid|deltoideo
descending|descendente
diagonal|diagonal
digital|digital
distal|distal
dorsal|dorsal
endocrine|endocrino
esophageal|esofágico
oesophageal|esofágico
ethmoidal|etmoidal
external|externo
extra-ocular|extraocular
extrahepatic|extrahepático
extrinsic|extrínseco
facial|facial
false|falso
fascial|fascial
faucial|de las fauces
femoral|femoral
fibrous|fibroso
fibular|peroneo
flat|plano
flexor|flexor
floating|flotante
free|libre
frontal|frontal
frontobasal|frontobasal
fusiform|fusiforme
gastric|gástrico
gastro-epiploic|gastroepiploico
gastroepiploic|gastroepiploico
gastroduodenal|gastroduodenal
gastrointestinal|gastrointestinal
geniculate|geniculado
genicular|genicular
genital|genital
gluteal|glúteo
great|mayor
hemiazygos|hemiácigos
hepatic|hepático
hepatovenous|hepatovenoso
heterogeneous|heterogéneo
hollow|hueco
humeral|humeral
hyo-epiglottic|hioepiglótico
hypothalamic|hipotalámico
hypothenar|hipotenar
ileal|ileal
ileocecal|ileocecal
ileocolic|ileocólico
iliac|ilíaco
iliolumbar|iliolumbar
iliotibial|iliotibial
immaterial|inmaterial
inferior|inferior
inferomedial|inferomedial
infrahyoid|infrahioideo
infratrochlear|infratroclear
innermost|íntimo
insular|insular
integumentary|tegumentario
intercostal|intercostal
intermediate|intermedio
intermediomedial|intermediomedial
internal|interno
interosseous|interóseo
interpeduncular|interpeduncular
interventricular|interventricular
intervertebral|intervertebral
intracranial|intracraneal
intrahepatic|intrahepático
intrapulmonary|intrapulmonar
intrinsic|intrínseco
investing|de revestimiento
irregular|irregular
jugular|yugular
lacrimal|lagrimal
laryngeal|laríngeo
lateral|lateral
laterobasal|laterobasal
limbic|límbico
lingular|lingular
lobar|lobar
lobular|lobulillar
long|largo
loose|laxo
lower|inferior
lumbar|lumbar
main|principal
major|mayor
mammillary|mamilar
mandibular|mandibular
marginal|marginal
material|material
maxillary|maxilar
medial|medial
median|mediano
mediobasal|mediobasal
membranous|membranoso
mesenteric|mesentérico
metacarpal|metacarpiano
metatarsal|metatarsiano
middle|medio
mitral|mitral
mucoid|mucoide
musculophrenic|musculofrénico
musculoskeletal|musculoesquelético
myocardial|miocárdico
nasal|nasal
nasociliary|nasociliar
nasolacrimal|nasolagrimal
navicular|navicular
nervous|nervioso
neural|neural
nonparenchymatous|no parenquimatoso
nonskeletal|no esquelético
nuclear|nuclear
oblique|oblicuo
obturator|obturador
occipital|occipital
oculomotor|oculomotor
ophthalmic|oftálmico
optic|óptico
orbital|orbitario
osseous|óseo
palatine|palatino
palmar|palmar
pancreatic|pancreático
pancreaticobiliary|pancreatobiliar
pancreaticoduodenal|pancreatoduodenal
papillary|papilar
paracentral|paracentral
parahippocampal|parahipocampal
parasympathetic|parasimpático
parenchymatous|parenquimatoso
parietal|parietal
patellar|rotuliano
pectoral|pectoral
pelvic|pélvico
perforating|perforante
pericallosal|pericalloso
perineal|perineal
peritoneal|peritoneal
pharyngeal|faríngeo
phrenic|frénico
physical|físico
plantar|plantar
pneumatized|neumatizado
polar|polar
pontine|pontino
popliteal|poplíteo
portal|portal
postcentral|poscentral
postcommunicating|poscomunicante
posterior|posterior
posteromedial|posteromedial
postvertebral|posvertebral
pre-hepatic|prehepático
precentral|precentral
precommunicating|precomunicante
precuneal|del precúneo
prefrontal|prefrontal
prevertebral|prevertebral
proper|propio
proximal|proximal
pterygomandibular|pterigomandibular
pubic|púbico
pudendal|pudendo
pulmonary|pulmonar
pulmopleural|pulmopleural
radial|radial
rectal|rectal
recurrent|recurrente
renal|renal
respiratory|respiratorio
rotator|rotador
sacral|sacro
salivary|salival
scalene|escaleno
scapular|escapular
segmental|segmentario
septal|septal
serous|seroso
sesamoid|sesamoideo
short|corto
sigmoid|sigmoideo
skeletal|esquelético
small|menor
soft|blando
solid|sólido
sphenoid|esfenoidal
spinal|espinal
splenial|esplenial
splenic|esplénico
sternal|esternal
sternocostal|esternocostal
straight|recto
stylohyoid|estilohioideo
subarachnoid|subaracnoideo
subclavian|subclavio
subcostal|subcostal
subendocardial|subendocárdico
sublingual|sublingual
submandibular|submandibular
suboccipital|suboccipital
subscapular|subescapular
subsegmental|subsegmentario
subsuperior|subsuperior
superficial|superficial
superior|superior
supra-orbital|supraorbitario
suprahyoid|suprahioideo
supramarginal|supramarginal
suprarenal|suprarrenal
suprascapular|supraescapular
supratrochlear|supratroclear
supreme|supremo
suspensory|suspensorio
systemic|sistémico
tarsal|tarsiano
temporal|temporal
temporo-occipital|temporooccipital
tendinous|tendinoso
terminal|terminal
testicular|testicular
thalamogeniculate|talamogeniculado
thalamoperforating|talamoperforante
thenar|tenar
thoracic|torácico
thoraco-acromial|toracoacromial
thoracodorsal|toracodorsal
thyro-epiglottic|tiroepiglótico
thyrocervical|tirocervical
thyrohyoid|tirohioideo
thyroid|tiroideo
tibial|tibial
tracheobronchial|traqueobronquial
transverse|transverso
tricuspid|tricúspide
trigeminal|trigémino
trochlear|troclear
true|verdadero
typical|típico
ulnar|cubital
upper|superior
ureteric|ureteral
urinary|urinario
uvular|de la úvula
variant|variante
vascular|vascular
vena caval|de la vena cava
venous|venoso
ventricular|ventricular
vertebral|vertebral
vertical|vertical
visceral|visceral
vocal|vocal
xiphoid|xifoideo
zygomatic|cigomático
`);
const feminine = new Set('aorta apófisis amígdala anastomosis arteria arterias aurícula base boca cabeza caja cámara capa cápsula cara carótida cavidad cavidades ceja cintura clavícula columna comisura continuidad córnea corona coroides corteza costilla costillas decusación división duramadre encía entidad epidermis epiglotis escápula esclerótica espalda estría fascia falange faringe formación fosa glándula glándulas habénula hipofisis hipófisis hoja ínsula lámina lengua línea mandíbula mano médula mejilla membrana muñeca musculatura nariz órbita pared paredes parte partes pelvis piel pierna porción próstata rama ramas raíz región regiones retina rodilla rótula sínfisis subcorteza subdivisión sustancia tenia tibia tienda tráquea tróclea úvula uretra unión valva valvas válvula válvulas vasculatura vena venas vesícula vejiga vértebra vértebras zona'.split(' '));
const plurals = new Set('arterias venas vértebras músculos ramas partes regiones órganos conjuntos cavidades paredes costillas'.split(' '));
for (const head of ['cadera', 'arquicorteza', 'cortina', 'estructura', 'incisura', 'placa', 'red']) feminine.add(head);
function phrase(text) { const head = text.split(' ')[0]; return { text, feminine: feminine.has(head), plural: plurals.has(head) }; }
function agree(adjective, noun) {
  if (adjective.startsWith('de ')) return adjective;
  let value = adjective;
  if (noun.feminine && value.endsWith('o')) value = value.slice(0, -1) + 'a';
  if (noun.feminine && /(?:suspensor|constrictor|flexor|rotador|obturador)$/.test(value)) value += 'a';
  if (noun.plural) value = value === 'común' ? 'comunes' : value + (/[aeiouáéíóú]$/.test(value) ? 's' : /s$/.test(value) ? '' : 'es');
  return value;
}
function append(noun, adjective) {
  // Keep modifiers with their head noun, ahead of prepositional complements.
  const position = noun.text.search(/ (?:de|del|con|en|a|al|para|desde|entre) /);
  const offset = position < 0 ? noun.text.length : position;
  return { ...noun, text: `${noun.text.slice(0, offset)} ${agree(adjective, noun)}${noun.text.slice(offset)}` };
}
function article(noun) { return noun.plural ? (noun.feminine ? 'las' : 'los') : noun.feminine ? 'la' : 'el'; }
const ordinals = parse('first|primer\nsecond|segundo\nthird|tercer\nfourth|cuarto\nfifth|quinto\nsixth|sexto\nseventh|séptimo\neighth|octavo\nninth|noveno\ntenth|décimo\neleventh|undécimo\ntwelfth|duodécimo');
const cache = new Map();
export function translatePhrase(input) {
  const name = input.toLowerCase().trim();
  if (cache.has(name)) return cache.get(name);
  let result;
  if (terms[name]) result = phrase(terms[name]);
  if (!result) {
    const side = /^(left|right) (.+)$/.exec(name);
    if (side) result = append(translatePhrase(side[2]), side[1] === 'left' ? 'izquierdo' : 'derecho');
  }
  if (!result) {
    const join = /^(.*?)\s+(of|with|and|in|to|at|for|from|between)\s+(.+)$/.exec(name);
    if (join) {
      const left = translatePhrase(join[1]), right = translatePhrase(join[3]);
      const prep = { of: 'de', with: 'con', and: 'y', in: 'en', to: 'a', at: 'en', for: 'para', from: 'desde', between: 'entre' }[join[2]];
      const connector = join[2] === 'and' ? prep : `${prep} ${article(right)}`.replace(/^de el$/, 'del').replace(/^a el$/, 'al');
      result = { ...left, text: `${left.text} ${connector} ${right.text}` };
    }
  }
  if (!result) {
    const numbered = /^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|\d+(?:st|nd|rd|th)?) (.+)$/.exec(name);
    if (numbered) {
      const noun = translatePhrase(numbered[2]);
      const order = ordinals[numbered[1]];
      const prefix = order ? noun.feminine ? ({ primer: 'primera', tercer: 'tercera' }[order] ?? agree(order, noun)) : order : `${parseInt(numbered[1])}.${noun.feminine ? 'ª' : 'º'}`;
      result = { ...noun, text: `${prefix} ${noun.text}` };
    }
  }
  if (!result) {
    const suffix = /^(.+?) (\d+|[ivx]+)$/.exec(name);
    if (suffix) { const noun = translatePhrase(suffix[1]); result = { ...noun, text: `${noun.text} ${suffix[2].toUpperCase()}` }; }
  }
  if (!result) {
    for (const adjective of Object.keys(adjectives).sort((a, b) => b.length - a.length)) {
      if (name.startsWith(adjective + ' ')) { result = append(translatePhrase(name.slice(adjective.length + 1)), adjectives[adjective]); break; }
    }
  }
  if (!result) throw new Error(name);
  cache.set(name, result);
  return result;
}
export function translateName(name) { const { text } = translatePhrase(name); return text[0].toUpperCase() + text.slice(1); }
