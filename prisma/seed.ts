import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const READING_PASSAGE = `Architectural theory is the act of hypothesizing, examining, and theorizing about the nature of architecture, and its impact on the surrounding environment and the human experience. In the contemporary era, architecture has shifted from purely aesthetic considerations to more sustainable, socially responsible practices.

Early 20th-century movements like Bauhaus pioneered the concept of "form follows function," a mantra that redefined how we interact with interior spaces. This philosophy suggests that the purpose of a building should be the starting point for its design.

However, critics of late-modernist theory argue that this focus on utility often ignores the cultural and emotional significance of structures. The emergence of Post-Modernism in the late 1960s reintroduced elements of historical reference, wit, and ornamentation into the architectural vocabulary.

Today, we witness a convergence of these ideals, where smart technology integrates seamlessly into heritage-inspired designs. Architects are now tasked with balancing the carbon footprint of construction with the timeless beauty of form.`;

type SeedQuestion = {
  prompt: string;
  hint?: string;
  choices: [string, boolean][]; // [text, isCorrect]
};

const readingQuestions: SeedQuestion[] = [
  {
    prompt: "According to the passage, what was the primary focus of the Bauhaus movement?",
    hint: "Reread the second paragraph of the text to find the Bauhaus mantra.",
    choices: [
      ["The reintroduction of historical ornamentation into modern facades.", false],
      ["The prioritization of utility and function as the basis of design.", true],
      ["Balancing the carbon footprint with aesthetic beauty.", false],
      ["The integration of smart technologies into interior spaces.", false],
    ],
  },
  {
    prompt: "What did critics of late-modernist theory argue?",
    choices: [
      ["That it was too expensive to build.", false],
      ["That it ignored the cultural and emotional significance of structures.", true],
      ["That it lacked structural integrity.", false],
      ["That it was indistinguishable from Post-Modernism.", false],
    ],
  },
  {
    prompt: "When did Post-Modernism emerge, according to the passage?",
    choices: [
      ["Early 20th century.", false],
      ["The 1980s.", false],
      ["The late 1960s.", true],
      ["The present day.", false],
    ],
  },
  {
    prompt: "What are architects balancing today, per the final paragraph?",
    choices: [
      ["Cost versus speed of construction.", false],
      ["Carbon footprint versus the timeless beauty of form.", true],
      ["Government regulation versus artistic freedom.", false],
      ["Digital design versus manual drafting.", false],
    ],
  },
  {
    prompt: "What does 'form follows function' suggest?",
    choices: [
      ["Decoration should come before purpose.", false],
      ["A building's purpose should be the starting point for its design.", true],
      ["Function is irrelevant to architecture.", false],
      ["Historical reference should guide all design.", false],
    ],
  },
  {
    prompt: "How does the passage describe today's architectural convergence?",
    choices: [
      ["Smart technology integrating into heritage-inspired designs.", true],
      ["A complete rejection of all historical styles.", false],
      ["Architecture becoming purely digital.", false],
      ["A return to strictly Bauhaus principles.", false],
    ],
  },
];

const grammarQuestions: SeedQuestion[] = [
  {
    prompt: "Choose the correct form: 'By the time she arrived, the meeting ___ already started.'",
    choices: [
      ["has", false],
      ["had", true],
      ["have", false],
      ["was", false],
    ],
  },
  {
    prompt: "Which sentence uses the subjunctive mood correctly?",
    choices: [
      ["If I was rich, I would travel.", false],
      ["If I were rich, I would travel.", true],
      ["If I am rich, I would travel.", false],
      ["If I will be rich, I would travel.", false],
    ],
  },
  {
    prompt: "Select the correctly punctuated sentence.",
    choices: [
      ["Its important to check, your work.", false],
      ["It's important to check your work.", true],
      ["Its' important to check your work.", false],
      ["It is important, to check your work", false],
    ],
  },
  {
    prompt: "Choose the correct comparative: 'This exam is ___ than the last one.'",
    choices: [
      ["more difficult", true],
      ["difficulter", false],
      ["most difficult", false],
      ["difficult", false],
    ],
  },
  {
    prompt: "Which word correctly completes: 'Neither the teacher nor the students ___ ready.'",
    choices: [
      ["is", false],
      ["was", false],
      ["were", true],
      ["be", false],
    ],
  },
  {
    prompt: "Choose the correct passive form: 'The report ___ by the team next week.'",
    choices: [
      ["will complete", false],
      ["will be completed", true],
      ["completes", false],
      ["is completing", false],
    ],
  },
  {
    prompt: "Select the sentence with correct subject-verb agreement.",
    choices: [
      ["Each of the students have a laptop.", false],
      ["Each of the students has a laptop.", true],
      ["Each of the students having a laptop.", false],
      ["Each of the students to have a laptop.", false],
    ],
  },
  {
    prompt: "Which is the correct use of 'fewer' vs 'less'?",
    choices: [
      ["There are less students this year.", false],
      ["There are fewer students this year.", true],
      ["There are fewer of student this year.", false],
      ["There is fewer students this year.", false],
    ],
  },
];

const listeningQuestions: SeedQuestion[] = [
  {
    prompt: "In the recording, what time does the library close on weekdays?",
    choices: [
      ["6:00 PM", false],
      ["8:00 PM", true],
      ["9:00 PM", false],
      ["10:00 PM", false],
    ],
  },
  {
    prompt: "What does the speaker recommend doing before the exam?",
    choices: [
      ["Reviewing lecture notes", true],
      ["Skipping breakfast", false],
      ["Arriving late to avoid crowds", false],
      ["Bringing a laptop", false],
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);
  const user = await prisma.user.upsert({
    where: { email: "alex@itep.test" },
    update: {},
    create: {
      email: "alex@itep.test",
      name: "Alex Johnson",
      studentId: "88291",
      passwordHash,
    },
  });
  console.log("Seeded user:", user.email);

  const examData: {
    title: string;
    description: string;
    category: "READING" | "GRAMMAR" | "LISTENING" | null;
    durationMin: number;
    difficulty: string;
    sectionTitle: string;
    sectionSkill: "READING" | "GRAMMAR" | "LISTENING";
    passage?: string;
    questions: SeedQuestion[];
  }[] = [
    {
      title: "iTEP Academic Plus #104",
      description: "Full-length academic reading & writing module with a timed passage.",
      category: "READING",
      durationMin: 60,
      difficulty: "Moderate",
      sectionTitle: "Reading & Writing Module",
      sectionSkill: "READING",
      passage: READING_PASSAGE,
      questions: readingQuestions,
    },
    {
      title: "Grammar Fundamentals B2",
      description: "Core grammar checkpoints for intermediate-to-advanced learners.",
      category: "GRAMMAR",
      durationMin: 30,
      difficulty: "Moderate",
      sectionTitle: "Grammar Fundamentals",
      sectionSkill: "GRAMMAR",
      questions: grammarQuestions,
    },
    {
      title: "Advanced Listening #12",
      description: "Short audio-based comprehension checkpoints.",
      category: "LISTENING",
      durationMin: 20,
      difficulty: "Easy",
      sectionTitle: "Listening Comprehension",
      sectionSkill: "LISTENING",
      questions: listeningQuestions,
    },
  ];

  const createdExams: { id: string; title: string }[] = [];

  for (const exam of examData) {
    const existing = await prisma.exam.findFirst({ where: { title: exam.title } });
    if (existing) {
      createdExams.push({ id: existing.id, title: existing.title });
      continue;
    }

    const created = await prisma.exam.create({
      data: {
        title: exam.title,
        description: exam.description,
        category: exam.category,
        durationMin: exam.durationMin,
        difficulty: exam.difficulty,
        sections: {
          create: [
            {
              title: exam.sectionTitle,
              skill: exam.sectionSkill,
              order: 0,
              passage: exam.passage,
              questions: {
                create: exam.questions.map((q, qIndex) => ({
                  prompt: q.prompt,
                  hint: q.hint,
                  order: qIndex,
                  choices: {
                    create: q.choices.map(([text, isCorrect], cIndex) => ({
                      label: String.fromCharCode(65 + cIndex), // A, B, C, D
                      text,
                      isCorrect,
                    })),
                  },
                })),
              },
            },
          ],
        },
      },
    });
    createdExams.push({ id: created.id, title: created.title });
    console.log("Seeded exam:", created.title);
  }

  const studyMaterialCount = await prisma.studyMaterial.count();
  if (studyMaterialCount === 0) {
  await prisma.studyMaterial.createMany({
    data: [
      {
        title: "iTEP Grammar Handbook",
        description: "A complete reference covering tense, mood, and agreement rules.",
        skill: "GRAMMAR",
        type: "PDF",
        url: "https://example.com/materials/grammar-handbook.pdf",
      },
      {
        title: "Reading Strategies for Academic Passages",
        description: "Techniques for skimming, scanning, and inference questions.",
        skill: "READING",
        type: "Article",
        url: "https://example.com/materials/reading-strategies",
      },
      {
        title: "Listening Comprehension Drills",
        description: "Short audio clips with comprehension checkpoints.",
        skill: "LISTENING",
        type: "Video",
        url: "https://example.com/materials/listening-drills",
      },
      {
        title: "Writing Under Time Pressure",
        description: "Strategies for structuring timed essay responses.",
        skill: "WRITING",
        type: "Article",
        url: "https://example.com/materials/writing-under-pressure",
      },
    ],
  });
  console.log("Seeded study materials");
  }

  const courseData = [
    {
      title: "Mastering iTEP Speaking: Academic Precision",
      description: "Build fluency and confidence for the iTEP Speaking section with guided academic prompts.",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1Jl698o2GJnFVskfX_gV5Gk-k1gZXEHt6X-RmJeRMgMmifhQ1x-Fpe5hbJVSsjtDyc0u3R-9sIKvdRf6ro-D8aTZ6xa93f2TMllJcDOpsx4HjpJLix3ehhFtPmdsJfOzJvLv1VNX_hR2nxsn0gd8G0-hnM7ysuRj8pj7yON03zBhF_qYxRpw3wF-x4vT6LzITJX0CNKdlzPSUCV7nlaWZVwWHQatw99fQcvbQYaBoVGecKlcpQ6VCQekleGQVd1FaubvrtZ5rEw",
      priceCents: 12900,
      category: "Speaking",
      badge: "Most Popular",
      rating: 4.9,
      studentsCount: 1248,
      durationHours: 12,
      order: 0,
    },
    {
      title: "Advanced Writing Strategies for iTEP Academic",
      description: "Structure, argumentation, and editing techniques for the Academic Writing section.",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAX7s9mHTOJsgmVnFOvXRNXIyQPpeN2OVHu0mM0R-mok0A64X9i7bgRn7xFySKL88rnYpgLoKJ81IyIny4gDbzl9J-IlfSgL6Vwc2oYQnPvpFT2awNp3ebUSxCAiS_-3zvq7q607C6uEaC14Y39JcHMR6KrEbJFUhoDrmZWpdGLZJkdSTxP7hW3QEq6HBtq9GHUCctshxd4M-PCFexvqi5vBHvFjBbyb_KIqUIGthGmDAoEGrwPf9l8AZFFFra1I5VeJxwqxr9ogu8",
      priceCents: 14900,
      category: "Writing",
      badge: "Expert Led",
      rating: 4.7,
      studentsCount: 856,
      durationHours: 8,
      order: 1,
    },
    {
      title: "Complete iTEP Reading Comprehension Intensive",
      description: "Skimming, scanning, and inference practice across academic passage types.",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAZf_UIvPk6rD-x0HoV8uN4Z1xxnSH3UsIDAm-peoITvSSfHeRWvy-OXaEAXCw2qwejmB9AxHRvknR06ph1fQybzRCoEDW95NQGg9yj4QZh9OZRo6CBWzOSVHt34XTUyvH5_jQi7EQxTuS0D18a2eQoYI62hO06PZlR8BcrEKe3DO2LYewnIsEnsKvjmM4RNHqjzqW-j8EP9dROj4IKXVWwFDgEfi3z7IBku7guciplqb2ycFFapiCO3oRGm8xJdyzZgGmfLZL20uY",
      priceCents: 19900,
      category: "Reading",
      badge: null,
      rating: 5.0,
      studentsCount: 2104,
      durationHours: 15,
      order: 2,
    },
    {
      title: "Listening Skills: Mastering Complex Audio Samples",
      description: "Train your ear on native-paced academic and conversational audio.",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCuSGllsQRKDoSYgjaviLl65ZzaefuoQDFffoG6hrn5H3WBfEyVjluxUSeluJzluaWHI8FhshrkdVo8Kv4cnerAFWWZIuNGTUsW_DHfLovtqk1EFCInyxHhQz7ZQMicLi5dmCNOo3FzNvBGWajE7cD_y_A2TBAAulmwbfMa4qU38wd4b97iSn48elZ6uDwjcnwc1x_sWD5FtvcXPKpJRp58ZHSJqJ6LldZe72arDScbPK9P2jdnicgGKDNWS5cMV73NDLI2IsjpDyA",
      priceCents: 9900,
      category: "Listening",
      badge: null,
      rating: 4.8,
      studentsCount: 642,
      durationHours: 6,
      order: 3,
    },
    {
      title: "iTEP Business: Professional Communication Excellence",
      description: "Workplace-focused English for corporate and trade communication contexts.",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA51o6vcGtB2UrB2B6yyo35nvJVo4vTcExhLffpZLV0EMehpKoc6qi9zPG03OWU-hDeE8IG2eL9RlVovwBCT3_JliS0Jsxy1sKDcMsfSMEkjltn8lufuLRHyBnsK4n9HUqazhvKDfA9YohBd_gcjo6FGk5CY-2qxHih3CR8VBU1RdVHkfn0oC5nSW1iZXocsEoVzm_D-655zXmfLvvH8iVt7TrbPfsqb_iRiUB7KIP46SA_7OUMdKIyq401riiE2r1UqWRUc5PZsiQ",
      priceCents: 15900,
      category: "Business",
      badge: null,
      rating: 4.6,
      studentsCount: 429,
      durationHours: 10,
      order: 4,
    },
  ];

  for (const course of courseData) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    if (!existing) {
      await prisma.course.create({ data: course });
      console.log("Seeded course:", course.title);
    }
  }

  // One already-submitted attempt on Grammar Fundamentals B2 so the dashboard
  // and results page aren't empty on first login.
  const grammarExam = await prisma.exam.findFirst({
    where: { title: "Grammar Fundamentals B2" },
    include: { sections: { include: { questions: { include: { choices: true } } } } },
  });

  if (grammarExam) {
    const existingAttempt = await prisma.attempt.findFirst({
      where: { userId: user.id, examId: grammarExam.id, status: "SUBMITTED" },
    });

    if (!existingAttempt) {
      const questions = grammarExam.sections.flatMap((s) => s.questions);
      const startedAt = new Date(Date.now() - 26 * 24 * 60 * 60 * 1000); // ~26 days ago
      const submittedAt = new Date(startedAt.getTime() + 18 * 60 * 1000);

      const attempt = await prisma.attempt.create({
        data: {
          userId: user.id,
          examId: grammarExam.id,
          status: "SUBMITTED",
          startedAt,
          submittedAt,
          timeLimitSec: grammarExam.durationMin * 60,
          currentIndex: questions.length - 1,
        },
      });

      let correctCount = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        // Miss exactly one question (index 2) to produce a realistic <100% score.
        const chosenChoice = i === 2 ? q.choices.find((c) => !c.isCorrect)! : q.choices.find((c) => c.isCorrect)!;
        if (chosenChoice.isCorrect) correctCount++;

        await prisma.answer.create({
          data: {
            attemptId: attempt.id,
            questionId: q.id,
            choiceId: chosenChoice.id,
            isCorrect: chosenChoice.isCorrect,
          },
        });
      }

      const scorePct = (correctCount / questions.length) * 100;
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { scorePct },
      });

      console.log(`Seeded submitted attempt for "${grammarExam.title}" — score ${scorePct.toFixed(1)}%`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
