# I Built a Web App With Zero Coding Skills (And Lived to Tell the Tale)

## How I went from MySpace layouts to deploying a full-stack app in a weekend, armed with nothing but Claude AI and the audacity of a woman who once thought `<marquee>` was cutting-edge technology.

---

**By Sophie Clifton-Tucker**

---

### The Problem: Herding Cats (AKA My Friends)

Let me paint you a picture.

It's 11pm on a Wednesday. I'm 47 messages deep into a WhatsApp group called "Sophie's Hen Do 2025 FINAL (2)". Someone has sent a poll. Someone else has ignored the poll and sent their availability in paragraph form. A third person has replied "I'm free whenever!" which, as we all know, means absolutely nothing.

I close WhatsApp. I open it again immediately, like someone checking the fridge hoping new food has materialised.

This dance continues for three weeks. By the end, I've aged approximately seven years and we still don't have a date.

Sound familiar?

I thought so.

---

### The "I Could Build That" Moment

Here's the thing about being a chronic problem-solver with the technical skills of a 2006 teenager: you have lots of ideas and absolutely no business attempting most of them.

But this time felt different. I'd been hearing whispers about AI coding assistants that could turn plain English into actual, working code. "Just tell it what you want," they said. "It's like magic," they said.

*Reader, I was skeptical.*

My last foray into "coding" involved CSS-ing my MySpace page to have a black background with pink sparkly text (iconic, if I do say so myself), and building questionable fansites on Geocities and Freewebs. I peaked at making text blink. That was 2005.

But I downloaded [Claude Code](https://claude.ai/code) anyway, because apparently I enjoy humbling myself.

---

### What I Actually Built

**[Screenshot: Can Do homepage - clean, pink, simple form]**

Meet **Can Do** (cando.you) - a shared calendar tool that does one thing well: helps groups find dates that work for everyone.

No sign-up. No account creation. No 47-step onboarding flow asking for your mother's maiden name.

You create an event, share the link, people click dates they're free, and the app shows you where everyone overlaps. Revolutionary? No. Necessary? Absolutely.

Here's what it does:
- **Create an event** with a title and your name
- **Select dates** on a pretty calendar
- **Share a link** with your chaotic friends
- **See matches** highlighted in green when dates align
- **Real-time updates** so you can watch responses roll in

---

### The Build: A Play in Several Anxious Acts

**[Screenshot: Claude Code terminal with conversation]**

#### Act 1: The Audacity of "Just Make Me an App"

My first prompt to Claude was something along the lines of:

*"I want to build a shared calendar app where people can vote on dates. Make it pink and pretty. I have no idea what I'm doing."*

And here's where things got interesting.

Instead of laughing me out of the terminal (which it absolutely could have done), Claude started... building. It chose Next.js (a React framework, for the non-nerds), set up a project structure, and began writing actual code.

I watched like a Victorian child seeing electricity for the first time.

**[Screenshot: Initial app running locally]**

Within about 20 minutes, I had a working prototype running on my laptop. It was ugly. It was basic. But dates were being selected and saved.

I may have screamed.

---

#### Act 2: "Make It Pretty" (The Fun Part)

This is where my years of obsessing over aesthetics finally paid off.

**[Screenshot: Before/after of the UI transformation]**

I didn't need to know CSS syntax. I just needed opinions - and oh, do I have opinions.

*"Make the background a soft pink. Not Barbie pink, more like... slightly blushing Victorian ghost."*

*"The font should be light and airy. We're going for 'expensive wellness retreat', not 'corporate team-building'."*

*"Can we make the buttons rounder? They look aggressive."*

Claude translated my unhinged briefs into actual code changes. We went through probably 15 iterations of the logo alone (I insisted on a curly "C" that matched my specific vision, and Claude patiently generated versions until I stopped making dolphin noises at my screen).

The colour palette evolved through at least 8 versions. At one point I asked for "sage green but make it soothing, like a fancy candle" and Claude somehow understood.

---

#### Act 3: The Database Situation (Where I Nearly Lost My Mind)

Here's where I'll admit things got spicy.

The app needed to actually *remember* things. Like, when someone selects dates, those dates need to still exist when they refresh the page. Groundbreaking concept, I know.

Claude set up something called Upstash Redis (I'm told this is a database; I'm choosing to believe it's a small elf that stores information). This involved:

1. Creating an account on Upstash
2. Copying some secret keys
3. Pasting them into a file called `.env.local`

Did I understand what was happening? Absolutely not. Did it work? *Somehow, yes.*

**[Screenshot: Redis dashboard showing stored events]**

---

#### Act 4: Going Live (AKA The Terrifying Bit)

Getting the app onto the actual internet involved:

1. **Pushing to GitHub** - Claude walked me through this like I was a particularly confused golden retriever. `git add`, `git commit`, `git push`. I nodded and typed.

2. **Deploying to Vercel** - This is apparently where Next.js apps like to live. I connected my GitHub, clicked some buttons, and suddenly my app had a real URL.

3. **Custom domain** - I bought `cando.you` from Porkbun (excellent name for a company, 10/10) and pointed it at my Vercel deployment.

**[Screenshot: DNS settings being configured]**

The DNS propagation took about 5 minutes, during which I refreshed the page approximately 4,000 times.

And then... it worked.

**[Screenshot: Live site on cando.you]**

---

### The Details That Made Me Irrationally Happy

Once the basics worked, I became completely unhinged with feature requests:

**The rotating footer messages:**
Instead of a boring "Made by Sophie", I asked for random funny messages that change on refresh:

- "Built after one too many 'when works for everyone?' texts"
- "Powered by the tears of failed WhatsApp polls"
- "Because herding cats is easier than herding friends"

**[Screenshot: Different footer messages]**

**The "Dates Saved!" toast:**
When you save your dates, a little green notification pops up. It's completely unnecessary and I love it deeply.

**[Screenshot: Save confirmation toast]**

**The social proof counter:**
The homepage shows how many events have been created. It's currently showing real data, which means real humans are using this thing I made while wearing pyjamas.

**[Screenshot: "X events created and counting!" pill]**

---

### What I Learned (The Mildly Profound Bit)

**1. You don't need to understand everything to build something.**

I still couldn't explain what half the code does. But I know what it *achieves*, and I could direct the changes I wanted. That's a different kind of skill - more creative director than engineer.

**2. AI doesn't replace taste.**

Claude could write perfect code, but it couldn't know I wanted "slightly blushing Victorian ghost" pink. The vision, the pickiness, the "no, not THAT shade" moments - those were all me. AI is a remarkably capable intern, not a replacement for having opinions.

**3. The barrier to building is genuinely lower now.**

I made a full-stack web application. With a database. That real people can use. Two years ago, this would have required either months of learning or thousands of pounds hiring a developer. Now it required a weekend and a lot of tea.

**4. Deployment is still fiddly.**

Even with AI help, there were moments of genuine confusion. Environment variables, DNS records, and favicon formats all caused mini-meltdowns. But the mini-meltdowns were *solvable*, usually within minutes.

---

### The Technical Bits (For Those Who Care)

For the developers reading this wondering what was actually built:

- **Framework:** Next.js 16 (App Router)
- **Database:** Upstash Redis
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Domain:** Porkbun
- **Analytics:** Vercel Analytics
- **AI Assistant:** Claude Code (Claude Opus 4)

The entire codebase is a handful of files. The calendar component is probably the most complex bit, handling date selection, multi-participant display, and colour-coding for matches.

**[Screenshot: Code structure in VS Code]**

---

### Would I Do It Again?

Already planning my next project, actually.

The whole experience fundamentally changed how I think about building things. I'm no longer limited by what I can technically execute - I'm only limited by what I can imagine and articulate.

For other non-technical people thinking about building something: do it. Start messy. Describe what you want in plain English. Expect frustration. Embrace the weird pride that comes from seeing something you made exist in the world.

And if you need to organise a group event, you know where to find me.

---

**Try it:** [cando.you](https://cando.you)

**Find me:** [LinkedIn](https://linkedin.com/in/sophiecliftontucker) | [Twitter/X](https://x.com/sophypophy)

---

*Sophie Clifton-Tucker is a writer, journalist, and accidental app developer based in Gibraltar. Her previous technical achievements include a truly magnificent MySpace layout (RIP) and successfully connecting to WiFi on the first try (once).*

---

## Screenshots Needed:

1. **Hero image:** Can Do homepage, clean and pretty
2. **Claude Code terminal:** Showing a conversation/code being written
3. **Before/after UI:** Early ugly version vs final polished version
4. **Live site:** The deployed cando.you in browser
5. **Footer messages:** Screenshot of the rotating funny footers
6. **Save toast:** The "Dates saved!" notification
7. **Social proof:** The events counter pill
8. **Code structure:** VS Code showing the project files (optional, for technical credibility)
9. **DNS settings:** Porkbun/Vercel configuration (optional)
10. **Mobile view:** App working on phone (shows responsiveness)

---

## Notes for Editing:

- Article is ~1,800 words - good length for Prototypr
- Sections are clearly delineated for easy scanning
- Screenshots break up the text and provide visual proof
- Technical content is accessible but doesn't patronize developers
- Tone is consistently conversational and self-deprecating
- Ends with clear CTA (try the app, follow me)
- Bio maintains the humorous voice
