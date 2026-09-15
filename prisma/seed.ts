import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = "demo-contortion-trio";
  const existing = await prisma.artist.findUnique({ where: { slug } });
  if (existing) {
    console.log("Demo artist already exists:", slug);
    return;
  }

  await prisma.artist.create({
    data: {
      slug,
      fullLegalName: "Demo Contortion Artist",
      stageName: "Rising Star Contortion",
      email: "demo-artist@mongolcircus.example",
      phone: "+976-0000-0000",
      nationality: "Mongolian",
      actTypes: JSON.stringify(["Contortion/Nugaralt", "Balance"]),
      actTitle: "Trio Contortion — Rising Stars",
      bioEn:
        "Award-winning Mongolian contortion artist represented by New Circus Center (MNCC). Precision flexibility, theatrical presence, and festival-ready staging for international contracts, cruise lines, and variety shows.",
      bioMn:
        "Монголын Нугаралтын уран бүтээлч. Шинэ Циркийн Төв (MNCC)-ийн уран бүтээлчдийн нөөцөд бүртгэгдсэн.",
      videoUrls: JSON.stringify([
        "https://youtu.be/rNOW8ODHGuI",
        "https://www.youtube.com/watch?v=E7UE2yEMmyI",
        "https://youtu.be/hCy2App3fnU",
      ]),
      videoFileUrls: JSON.stringify([]),
      photoUrls: JSON.stringify(["/demo-headshot.jpg", "/mncc-poster.jpg"]),
      resumeUrl: null,
      yearsExperience: 8,
      availabilityWindow: "Open — contact MNCC",
      preferredRegions: JSON.stringify(["Europe", "Asia", "Cruise", "Anywhere"]),
      desiredFeeNote: "Competitive international rates — inquire via MNCC",
      techRider: "Clean stage, non-slip floor, warm-up space 30 min prior.",
      agency: "New Circus Center (MNCC)",
      consent: true,
    },
  });

  console.log("Seeded demo artist:", slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
