import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { MyTicketsList } from "@/components/support/MyTicketsList";

export default async function TeacherSupportPage() {
  const session = await auth();
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-3xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Support</h1>
        <p className="text-body-md text-on-surface-variant">
          Have a question or ran into an issue? Send us a message and an admin will get back to you.
        </p>
      </div>

      <SupportTicketForm />

      <div>
        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">Your Messages</h3>
        <MyTicketsList tickets={tickets} />
      </div>
    </div>
  );
}
