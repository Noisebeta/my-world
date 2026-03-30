# Omii & Romii World — Full Rebuild

## Current State
Multi-page website exists with:
- LandingPage.tsx: Choose Your World cards for Omii & Romii
- OmiiPage.tsx: Basic cute pink page with generic content
- RomiiPage.tsx: Romantic dark page with timeline, secret modal (password: "forever")
- Supporting components: FloatingHearts, BackgroundParticles, GlassCard, PlaceholderImage, ScrollFadeIn

## Requested Changes (Diff)

### Add
- Landing page: birthday confetti animation, floating flowers/balloons, birthday icons, "Happy Birthday!" banner text
- Omii page: food-catching mini-game (food falls from top, drag basket to catch), confetti over hero banner, full meter popup "Bht khaa liya, jaake sojao Casper k saath", background music toggle
- Omii page: Casper dog section with label "Void's soulEnemy"
- Romii page: "Abilities" section (Hukum chalana, darana, caring)
- Romii page: Secret section with password "biwi" (NOT "forever"), popup with animated Romii placeholder, "Be My Girl/Valentine" button with sweet message, funny "No" button that grows each click and runs away on hover after 5 clicks
- Romii page: banner hero decorated with sunflowers 🌻, bite marks 😬, slap icons 👋
- Footers on both pages: "Made with love by Voiddd & Caffeine AI"
- Confetti + gift box animations on Romii sections

### Modify
- Landing page: upgrade to birthday theme with "Happy Birthday! 🎂" as main headline, confetti raining
- Omii page "About You": replace content with: yapping, chaotic, chubby (I like), clumsy, messy, fun-loving
- Omii page "Our Moments": fighting, eating, roaming/ghoomna, her stories, college chaos with fun icons
- Omii page "Likes & Fun Things": add food game, Casper, irritating & ordering things vibe
- Romii "Our Story": Enemies → Bestfriends → coding, gaming, late nights
- Romii "What I Love About You": eyes, voice, smile, attitude, nakhre, controlling, scary-yet-caring + likes list
- Romii secret password: change from "forever" to "biwi"
- Both footers: update text

### Remove
- Old "Things I Love About You" and "Favorite Things" cards from OmiiPage (replace with new sections)
- Old secret section with "forever" password on RomiiPage (replace with "biwi" + new UI)

## Implementation Plan
1. Update LandingPage.tsx — birthday theme, confetti rain animation, floating balloons/flowers, birthday icons on cards
2. Rebuild OmiiPage.tsx — corrected About You, Our Moments, Likes & Fun Things sections, food mini-game component, Casper section, confetti on hero, music toggle, new footer
3. Rebuild RomiiPage.tsx — decorated hero banner, corrected Our Story + What I Love + Abilities sections, new secret section (password: biwi), Valentine popup with growing/running No button, Our Moments section, new footer
4. Add FoodGame component for Omii's mini-game
5. Add Confetti component for birthday/section animations
6. Update index.css with new keyframes needed (confetti fall, balloon float, gift bounce)
