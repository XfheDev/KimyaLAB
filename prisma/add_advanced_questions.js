const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const subjects = [
        {
            name: "Modern Atom Teorisi",
            description: "Kuantum sayıları, dizilimler ve periyodik özellikler.",
            questions: [
                {
                    text: "Aşağıdaki kuantum sayılarından hangisi bir elektron için mümkün değildir?",
                    options: ["n=2, l=0, ml=0", "n=3, l=2, ml=-2", "n=1, l=1, ml=0", "n=4, l=3, ml=+1"],
                    correctOption: 2
                },
                {
                    text: "Sc (Z=21) atomunun temel hal elektron dizilimindeki en son orbital türü nedir?",
                    options: ["3p", "4s", "3d", "4p"],
                    correctOption: 2
                },
                {
                    text: "Aynı periyotta soldan sağa gidildikçe genellikle artan özellik hangisidir?",
                    options: ["Atom yarıçapı", "Elektronegatiflik", "Metalik özellik", "Elektron verme eğilimi"],
                    correctOption: 1
                },
                {
                    text: "Heisenberg Belirsizlik İlkesi neyi savunur?",
                    options: ["Elektronun hızı ölçülemez", "Elektronun konumu sabittir", "Hız ve konum aynı anda tam doğrulukla bilinemez", "Elektronlar yörüngelerde döner"],
                    correctOption: 2
                },
                {
                    text: "Uyarılmış haldeki bir atom için hangisi doğrudur?",
                    options: ["Daha kararlıdır", "Enerjisi temel halden düşüktür", "Enerji alarak gerçekleşir", "Çekirdek yapısı değişir"],
                    correctOption: 2
                }
            ]
        },
        {
            name: "Gazlar",
            description: "Gaz yasaları, kinetik teori ve ideal gaz denklemi.",
            questions: [
                {
                    text: "İdeal gaz denklemi (PV=nRT) ile ilgili hangisi yanlıştır?",
                    options: ["P basınçtır", "V hacimdir", "T santigrat derecedir", "R gaz sabitidir"],
                    correctOption: 2
                },
                {
                    text: "Düşük sıcaklık ve yüksek basınçta gazlar hangi duruma yaklaşır?",
                    options: ["İdeal hal", "Gerçek hal", "Plazma hal", "Kritik hal"],
                    correctOption: 1
                },
                {
                    text: "Boyle Yasasına göre sabit sıcaklıkta basınç ve hacim ilişkisi nasıldır?",
                    options: ["Doğru orantılı", "Ters orantılı", "Eşit", "Alakasız"],
                    correctOption: 1
                },
                {
                    text: "Normal şartlar altında (0°C, 1 atm) 1 mol ideal gaz kaç litre hacim kaplar?",
                    options: ["22,4 L", "24,5 L", "11,2 L", "44,8 L"],
                    correctOption: 0
                },
                {
                    text: "Gazların difüzyon hızı hangisine bağlı değildir?",
                    options: ["Sıcaklık", "Mol kütlesi", "Hacim", "Molekül ağırlığı"],
                    correctOption: 2
                }
            ]
        }
    ];

    console.log("Adding professional chemistry content...");

    for (const s of subjects) {
        const subject = await prisma.subject.upsert({
            where: { name: s.name },
            update: { description: s.description },
            create: { name: s.name, description: s.description }
        });

        for (const q of s.questions) {
            await prisma.question.create({
                data: {
                    text: q.text,
                    options: JSON.stringify(q.options),
                    correctOption: q.correctOption,
                    subjectId: subject.id
                }
            });
        }
        console.log(`✅ ${s.name} added with ${s.questions.length} questions.`);
    }

    // Adding more questions to existing subjects
    const existingSubject = await prisma.subject.findUnique({ where: { name: "Atomun Yapısı" } });
    if (existingSubject) {
        const extraQuestions = [
            {
                text: "Nötron sayısını keşfeden bilim insanı kimdir?",
                options: ["Chadwick", "Thomson", "Bohr", "Dalton"],
                correctOption: 0
            },
            {
                text: "Bir atomun kütle numarası neyin toplamıdır?",
                options: ["Proton + Elektron", "Proton + Nötron", "Nötron + Elektron", "Sadece Proton"],
                correctOption: 1
            }
        ];
        for (const q of extraQuestions) {
            await prisma.question.create({
                data: {
                    text: q.text,
                    options: JSON.stringify(q.options),
                    correctOption: q.correctOption,
                    subjectId: existingSubject.id
                }
            });
        }
        console.log(`✅ Added 2 extra questions to Atomun Yapısı.`);
    }

    console.log("All tasks completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
