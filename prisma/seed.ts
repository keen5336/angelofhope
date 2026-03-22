import { PrismaClient, Species, Sex, Size, AdoptionStatus, LocationType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Users
  const adminHash = await bcrypt.hash("admin123", 12);
  const staffHash = await bcrypt.hash("staff123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@pettrack.org" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@pettrack.org",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@pettrack.org" },
    update: {},
    create: {
      name: "Staff Member",
      email: "staff@pettrack.org",
      passwordHash: staffHash,
      role: UserRole.STAFF,
    },
  });

  console.log(`  ✓ Created users: ${admin.email}, ${staff.email}`);

  // Locations
  const shelter1 = await prisma.location.upsert({
    where: { id: "loc-shelter-1" },
    update: {},
    create: {
      id: "loc-shelter-1",
      name: "Happy Paws Animal Shelter",
      type: LocationType.SHELTER,
      address1: "456 Shelter Rd",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      notes: "Main intake and adoption shelter",
      isActive: true,
    },
  });

  const shelter2 = await prisma.location.upsert({
    where: { id: "loc-shelter-2" },
    update: {},
    create: {
      id: "loc-shelter-2",
      name: "Eastside Animal Center",
      type: LocationType.SHELTER,
      address1: "789 East Ave",
      city: "Portland",
      state: "OR",
      postalCode: "97215",
      isActive: true,
    },
  });

  const petStore = await prisma.location.upsert({
    where: { id: "loc-store-1" },
    update: {},
    create: {
      id: "loc-store-1",
      name: "Paws & Claws Pet Supply",
      type: LocationType.PET_STORE,
      address1: "321 Commerce Blvd",
      city: "Beaverton",
      state: "OR",
      postalCode: "97005",
      notes: "Saturday adoption events 10am–3pm",
      isActive: true,
    },
  });

  const foster1 = await prisma.location.upsert({
    where: { id: "loc-foster-1" },
    update: {},
    create: {
      id: "loc-foster-1",
      name: "Johnson Foster Home",
      type: LocationType.FOSTER,
      city: "Lake Oswego",
      state: "OR",
      isActive: true,
    },
  });

  const foster2 = await prisma.location.upsert({
    where: { id: "loc-foster-2" },
    update: {},
    create: {
      id: "loc-foster-2",
      name: "Chen Foster Home",
      type: LocationType.FOSTER,
      city: "Gresham",
      state: "OR",
      isActive: true,
    },
  });

  console.log("  ✓ Created 5 locations");

  // Tags
  const tagData = [
    { name: "Good with kids", category: "Temperament" },
    { name: "Good with dogs", category: "Temperament" },
    { name: "Good with cats", category: "Temperament" },
    { name: "Bonded pair", category: "Special" },
    { name: "Special needs", category: "Medical" },
    { name: "Vaccinated", category: "Medical", color: "#16a34a" },
    { name: "Senior", category: "Age", color: "#7c3aed" },
    { name: "Puppy", category: "Age", color: "#2563eb" },
    { name: "Kitten", category: "Age", color: "#db2777" },
    { name: "House trained", category: "Temperament", color: "#059669" },
  ];

  const tags: Record<string, { id: string }> = {};
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    });
    tags[t.name] = tag;
  }

  console.log(`  ✓ Created ${tagData.length} tags`);

  // Sample pets
  const pets = [
    {
      id: "pet-001",
      name: "Buddy",
      species: Species.DOG,
      breed: "Labrador Retriever Mix",
      sex: Sex.MALE,
      ageText: "3 years",
      size: Size.LARGE,
      color: "Yellow",
      description:
        "Buddy is a friendly and energetic Lab mix who loves everyone he meets. He's great with children and other dogs, and already knows basic commands. He needs a home with a yard where he can run and play. Buddy came to us after his previous owner had to move, and he's been the star of our shelter ever since!",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-10-15"),
      locationId: shelter1.id,
      photos: [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800",
      ],
      tags: ["Good with kids", "Good with dogs", "House trained", "Vaccinated"],
    },
    {
      id: "pet-002",
      name: "Luna",
      species: Species.CAT,
      breed: "Domestic Shorthair",
      sex: Sex.FEMALE,
      ageText: "1 year",
      size: Size.SMALL,
      color: "Black and white",
      description:
        "Luna is a playful, curious kitten who loves to explore. She was found as a stray and has blossomed into a social and affectionate cat. She'd do best as an indoor-only cat with patient owners who enjoy an active feline companion.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-11-01"),
      locationId: foster1.id,
      photos: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
      ],
      tags: ["Vaccinated", "House trained"],
    },
    {
      id: "pet-003",
      name: "Max",
      species: Species.DOG,
      breed: "German Shepherd",
      sex: Sex.MALE,
      ageText: "5 years",
      size: Size.LARGE,
      color: "Black and tan",
      description:
        "Max is a loyal and intelligent German Shepherd who was surrendered when his owner could no longer care for him. He's very well-trained, knows over 20 commands, and is calm indoors. Max does best as the only pet and would thrive with an experienced dog owner.",
      adoptionStatus: AdoptionStatus.PENDING,
      intakeDate: new Date("2025-09-20"),
      locationId: shelter1.id,
      photos: [
        "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800",
      ],
      tags: ["Vaccinated", "House trained"],
    },
    {
      id: "pet-004",
      name: "Whiskers",
      species: Species.CAT,
      breed: "Maine Coon Mix",
      sex: Sex.MALE,
      ageText: "8 years",
      size: Size.MEDIUM,
      color: "Orange tabby",
      description:
        "Whiskers is a gentle giant with a huge heart. This senior cat loves nothing more than a warm lap and a cozy spot by the window. He's wonderful with calm households and older children. Whiskers has some arthritis and takes a daily joint supplement, but it doesn't slow down his purring!",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-08-05"),
      locationId: shelter2.id,
      photos: [
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
      ],
      tags: ["Senior", "Good with kids", "Vaccinated"],
    },
    {
      id: "pet-005",
      name: "Daisy",
      species: Species.DOG,
      breed: "Beagle",
      sex: Sex.FEMALE,
      ageText: "2 years",
      size: Size.MEDIUM,
      color: "Tricolor",
      description:
        "Daisy is a sweet and sociable Beagle who loves sniffing out adventure. She's playful, loving, and gets along great with kids and other dogs. Daisy is house trained and crate trained. She has a typical Beagle nose, so a securely fenced yard is a must!",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-11-10"),
      locationId: petStore.id,
      photos: [
        "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800",
      ],
      tags: ["Good with kids", "Good with dogs", "House trained", "Vaccinated"],
    },
    {
      id: "pet-006",
      name: "Oliver",
      species: Species.CAT,
      breed: "Siamese Mix",
      sex: Sex.MALE,
      ageText: "4 months",
      size: Size.SMALL,
      color: "Seal point",
      description:
        "Oliver is an adorable Siamese-mix kitten with striking blue eyes and a chatty personality. He loves to play and cuddle in equal measure. He's been raised with other cats and is very social. Oliver would love a home where he has a feline companion to grow up with.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-12-01"),
      locationId: foster2.id,
      photos: [
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800",
      ],
      tags: ["Kitten", "Good with cats", "Vaccinated"],
    },
    {
      id: "pet-007",
      name: "Rosie",
      species: Species.DOG,
      breed: "Pit Bull Mix",
      sex: Sex.FEMALE,
      ageText: "4 years",
      size: Size.MEDIUM,
      color: "Brindle",
      description:
        "Rosie is one of the most affectionate dogs you'll ever meet. She was rescued from a neglect situation and has blossomed into a confident, loving girl. She knows her basic commands and loves to learn new tricks. She does best as the only dog but loves human company.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-07-22"),
      locationId: shelter1.id,
      photos: [
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
      ],
      tags: ["Good with kids", "House trained", "Vaccinated"],
    },
    {
      id: "pet-008",
      name: "Biscuit & Gravy",
      species: Species.RABBIT,
      breed: "Holland Lop",
      sex: Sex.UNKNOWN,
      ageText: "1.5 years",
      size: Size.SMALL,
      color: "White and gray",
      description:
        "Biscuit and Gravy are a bonded pair of Holland Lop rabbits who must be adopted together. They are litter trained, gentle, and love exploring their pen. They're perfect for a family looking for a quieter but equally lovable pet. They come with their enclosure.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-10-30"),
      locationId: shelter2.id,
      photos: [
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800",
      ],
      tags: ["Bonded pair", "Good with kids"],
    },
    {
      id: "pet-009",
      name: "Shadow",
      species: Species.CAT,
      breed: "Domestic Longhair",
      sex: Sex.FEMALE,
      ageText: "7 years",
      size: Size.MEDIUM,
      color: "Black",
      description:
        "Shadow is a dignified and independent senior cat who is looking for a quiet home. She was bonded to her previous elderly owner who passed away. Shadow takes time to warm up but becomes deeply loyal once she trusts you. She's great with calm older children and other calm cats.",
      adoptionStatus: AdoptionStatus.HOLD,
      intakeDate: new Date("2025-11-15"),
      locationId: foster1.id,
      photos: [
        "https://images.unsplash.com/photo-1520315342629-6ea920342047?w=800",
      ],
      tags: ["Senior", "Good with cats", "Vaccinated"],
    },
    {
      id: "pet-010",
      name: "Peanut",
      species: Species.DOG,
      breed: "Chihuahua Mix",
      sex: Sex.MALE,
      ageText: "6 years",
      size: Size.SMALL,
      color: "Tan",
      description:
        "Peanut is a spirited little guy with a big personality. He's loyal to his people and loves to cuddle under blankets. Peanut does best with adults or older children and prefers to be the only pet. He has some seasonal allergies managed with a monthly tablet.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-09-08"),
      locationId: petStore.id,
      photos: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
      ],
      tags: ["Special needs", "House trained", "Vaccinated"],
    },
    {
      id: "pet-011",
      name: "Mango",
      species: Species.BIRD,
      breed: "Cockatiel",
      sex: Sex.MALE,
      ageText: "3 years",
      size: Size.SMALL,
      color: "Yellow and gray",
      description:
        "Mango is a sweet and talkative cockatiel who knows several songs and can say his name. He's social and enjoys being out of his cage for supervised time. Mango was surrendered when his family moved abroad. He comes with his cage, food, and toys.",
      adoptionStatus: AdoptionStatus.AVAILABLE,
      intakeDate: new Date("2025-12-05"),
      locationId: shelter2.id,
      photos: [
        "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800",
      ],
      tags: ["Good with kids"],
    },
    {
      id: "pet-012",
      name: "Cleo",
      species: Species.CAT,
      breed: "Abyssinian Mix",
      sex: Sex.FEMALE,
      ageText: "2 years",
      size: Size.SMALL,
      color: "Ruddy",
      description:
        "Cleo is a lively and athletic cat who loves to climb, hunt, and play. She's affectionate on her own terms and would do well with an active household that appreciates an energetic cat. Cleo would enjoy a tall cat tree and interactive toys.",
      adoptionStatus: AdoptionStatus.ADOPTED,
      intakeDate: new Date("2025-06-15"),
      locationId: null,
      photos: [
        "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800",
      ],
      tags: ["Vaccinated"],
    },
  ];

  for (const petData of pets) {
    const { photos, tags: petTags, ...data } = petData;

    const pet = await prisma.pet.upsert({
      where: { id: data.id },
      update: {},
      create: {
        ...data,
        isActive: data.adoptionStatus !== AdoptionStatus.ADOPTED,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    // Photos
    await prisma.petPhoto.deleteMany({ where: { petId: pet.id } });
    if (photos.length > 0) {
      await prisma.petPhoto.createMany({
        data: photos.map((url, i) => ({
          petId: pet.id,
          url,
          sortOrder: i,
        })),
      });
    }

    // Tags
    await prisma.petTag.deleteMany({ where: { petId: pet.id } });
    for (const tagName of petTags) {
      const tag = tags[tagName];
      if (tag) {
        await prisma.petTag.create({
          data: { petId: pet.id, tagId: tag.id },
        });
      }
    }

    // Location history for pets with locations
    if (data.locationId) {
      const existingHistory = await prisma.petLocationHistory.findFirst({
        where: { petId: pet.id },
      });
      if (!existingHistory) {
        await prisma.petLocationHistory.create({
          data: {
            petId: pet.id,
            locationId: data.locationId,
            startDate: data.intakeDate || new Date(),
          },
        });
      }
    }
  }

  console.log(`  ✓ Created ${pets.length} pets`);
  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Demo credentials:");
  console.log("   Admin: admin@pettrack.org / admin123");
  console.log("   Staff: staff@pettrack.org / staff123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
