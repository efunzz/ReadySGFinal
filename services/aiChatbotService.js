const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// SCDF actual Emergency Handbook Context 
const HANDBOOK_SECTIONS = {
    first_aid: `
  FIRST AID (SCDF Emergency Handbook Chapter 1)
  
  Essential First Aid Skills from Singapore Civil Defence Force:
  
  BLEEDING:
  - Put on protective gloves or place barrier between you and casualty's blood
  - Check for foreign objects in wound - do not press on them if present
  - If no foreign objects: elevate injured limb above heart, place sterile gauze, apply direct pressure, secure with bandage
  - For large foreign objects: do not remove, build padding around object before bandaging
  
  CPR (Cardio-Pulmonary Resuscitation):
  1. Determine responsiveness - tap shoulders and shout
  2. Dial 995 for ambulance and get nearest AED
  3. Position casualty flat on back, perform head-tilt-chin-lift
  4. Check for breathing - look, listen, feel for 10 seconds
  5. If not breathing: locate breastbone, place heel of hand 2 fingers above notch
  6. Perform 30 compressions at 100+ per minute, 5cm deep
  7. Give 2 mouth-to-mouth ventilations
  8. Repeat 30:2 cycle until ambulance arrives
  
  CHOKING (Heimlich Manoeuvre):
  - Stand behind casualty, locate navel with ring finger
  - Place fist 2 fingers above navel, cover with other hand
  - Give quick inward and upward thrusts until object expelled
  
  BURNS - Use Four Cs:
  - Cool under cold water for 10+ minutes
  - Remove Constricting items before swelling
  - Cover with sterile dressing  
  - Consult doctor or dial 995 for severe burns
  
  Emergency Numbers: 995 (Emergency), 1777 (Non-emergency ambulance)
  `,
  
    fire_safety: `
  FIRE SAFETY (SCDF Emergency Handbook Chapter 2)
  
  Fire Prevention:
  - Don't leave cooking unattended, turn off appliances when not in use
  - Keep stove-tops clean and free of grease
  - Avoid loose sleeves near heat sources
  - Don't overload electrical outlets
  - Check for broken/exposed wiring
  - Keep lighters, matches away from children
  
  When Fire Breaks Out:
  1. Don't panic
  2. Evacuate room/area, get everyone out safely
  3. Dial 995 for SCDF
  4. Fight fire only if safe to do so
  5. Evacuate building via stairs (never lifts)
  6. Don't return until authorities say safe
  
  Fire Extinguisher - P.A.S.S. Method:
  - Pull safety pin
  - Aim nozzle at base of fire
  - Squeeze lever
  - Sweep side to side
  
  Vehicle Fire:
  - Slow down, drive to roadside
  - Turn off engine, evacuate immediately
  - Dial 995
  - Use fire extinguisher if fire small and safe
  - Move away if fire grows, warn others
  
  Home Fire Safety Checklist:
  - Install smoke detectors on ceiling near escape routes
  - Test detectors regularly, change batteries yearly
  - Have at least one dry chemical powder fire extinguisher
  - Keep escape routes clear
  `,
  
    floods: `
  FLOODS (SCDF Emergency Handbook Chapter 3)
  
  Singapore Flash Flood Safety:
  
  If at Home:
  - Stay put but grab Ready Bag, be prepared to evacuate when advised
  - If dangerous to remain, dial 995/999 and evacuate to higher ground
  - Move away from open areas, streams, storm drains
  - Tune to local radio for updates
  
  If in Vehicle:
  - Turn around, don't drive through flood water
  - "Turn Around, Don't Drown" - key principle
  - Don't drive around barricades
  - If vehicle stalls in rising water: abandon immediately, get to higher ground
  - Don't walk through moving water (15cm can knock you down)
  - Test ground ahead in stagnant water
  
  Key Safety Rules:
  - Never drive through flooded roads
  - 15cm moving water can make you fall
  - 60cm water can sweep away vehicles
  - Stay away from storm drains and canals
  - Seek higher ground immediately
  - Monitor weather alerts from NEA
  
  Emergency Contacts: 995 (SCDF), 999 (Police)
  `,
  
    ready_bag: `
  READY BAG & EMERGENCY SUPPLIES (SCDF Emergency Handbook Chapter 3)
  
  Ready Bag Essential Items:
  - Torchlight (without batteries fitted)
  - Extra batteries
  - Essential personal medications
  - Face masks and hand sanitizers
  - Waterproof folder with photocopies of important documents (NRIC, insurance)
  - Emergency whistle
  - First aid kit
  - Childcare supplies for special needs
  - N95 masks for air pollution protection
  
  Optional Items:
  - Personal contact numbers list
  - Emergency cash
  - Spare clothing (T-shirt, track pants)
  - Emergency numbers list (995, utility companies)
  
  Ready Bag Guidelines:
  - Keep portable, not too heavy/bulky
  - Store in easily accessible location (even in dark)
  - Check expiry dates regularly
  - Replace batteries periodically
  - Don't place batteries in devices until needed
  
  Stockpiling Recommendations:
  - Rice, instant noodles, canned foods
  - Cooking oil, frozen/canned meat and vegetables
  - Masks (surgical or reusable)
  - Hand sanitizer, disinfectant
  - Oral thermometers
  - Over-the-counter medications
  
  Store supplies according to dietary requirements, replace expired items regularly.
  `,
  
    emergency_contacts: `
  EMERGENCY CONTACTS (SCDF Emergency Handbook)
  
  Singapore Emergency Numbers:
  
  EMERGENCY SERVICES:
  - Fire, Police, Ambulance: 995
  - Police: 999
  - Non-Emergency Ambulance: 1777
  - SCDF Emergency SMS (for deaf/hearing impaired): 70995
  
  UTILITIES:
  - PUB Water Emergency: 1800 2255 782
  - SP PowerGrid (electricity): 1800 778 8888
  - City Gas (piped gas): 1800 752 1800
  
  REPORTING SERVICES:
  - Fire Hazard Reporting: 1800 280 0000
  - SCDF General Enquiries: 1800 286 5555
  - Police Hotline: 1800 255 0000
  - Building defects (non-HDB): 1800 342 5222
  - HDB Emergency Maintenance: 1800 275 5555
  
  APPS TO DOWNLOAD:
  - myResponder app: For cardiac arrest and fire alerts, AED locations
  - SGSecure app: Report suspicious activities, emergency updates
  - myEnv app: Weather and environmental data
  
  Remember: In life-threatening emergencies, always dial 995 first.
  For non-urgent matters, use the appropriate service numbers.
  `,
  
    terrorism: `
  TERRORISM & SECURITY (SCDF Emergency Handbook Chapter 5)
  
  SGSecure - Stay Alert, Stay United, Stay Strong
  
  In Event of Attack - RUN, HIDE, TELL:
  
  RUN:
  - Move quickly and quietly away from danger using safest route
  - Don't surrender or negotiate with attackers
  
  HIDE:
  - Stay out of sight, be quiet, switch phone to silent
  - Lock yourself in, stay away from doors
  
  TELL:
  - Call 999/SMS 71999 or use SGSecure app
  - Provide details about attackers and location
  
  Chemical/Biological Threats:
  - Cover nose and mouth with damp cloth
  - Move away from source, don't walk into wind
  - Seek shelter, perform In-Place Protection
  - If indoors: close windows/doors, turn off ventilation
  - Wait for decontamination by SCDF if exposed
  
  Bomb Threats:
  - Don't touch suspicious objects
  - Move away, warn others
  - Call 999 immediately
  - If receive phone threat: keep caller talking, note details
  - Don't use mobile phones near explosion sites
  
  Stay Alert for Suspicious Activity:
  - Unattended items in public areas
  - Someone loitering suspiciously  
  - Vehicle heading toward crowd not slowing
  - Report via SGSecure app or call 999
  
  After Attack:
  - Keep calm, get info from official sources
  - Don't spread rumors or share panic-inducing content
  - Encourage return to normal activities
  - Help injured using basic first aid if safe
  `,
  };
  
  export class AIChatbotService {
    // Smart section selection based on user query
    static getRelevantSections(userMessage) {
      const query = userMessage.toLowerCase();
      const sections = [];
  
      // First aid related keywords
      if (query.includes('bleeding') || query.includes('cpr') || query.includes('choking') || 
          query.includes('burn') || query.includes('first aid') || query.includes('injury') ||
          query.includes('unconscious') || query.includes('heimlich')) {
        sections.push(HANDBOOK_SECTIONS.first_aid);
      }
      
      // Fire safety keywords
      if (query.includes('fire') || query.includes('smoke') || query.includes('extinguisher') ||
          query.includes('burn') || query.includes('evacuat') || query.includes('alarm')) {
        sections.push(HANDBOOK_SECTIONS.fire_safety);
      }
      
      // Flood safety keywords
      if (query.includes('flood') || query.includes('water') || query.includes('rain') ||
          query.includes('drain') || query.includes('vehicle') && query.includes('water')) {
        sections.push(HANDBOOK_SECTIONS.floods);
      }
      
      // Emergency supplies keywords
      if (query.includes('ready bag') || query.includes('supplies') || query.includes('kit') ||
          query.includes('pack') || query.includes('stock') || query.includes('prepare')) {
        sections.push(HANDBOOK_SECTIONS.ready_bag);
      }
      
      // Contact/phone number keywords
      if (query.includes('contact') || query.includes('number') || query.includes('call') ||
          query.includes('995') || query.includes('999') || query.includes('phone')) {
        sections.push(HANDBOOK_SECTIONS.emergency_contacts);
      }
      
      // Security/terrorism keywords
      if (query.includes('terror') || query.includes('suspicious') || query.includes('bomb') ||
          query.includes('attack') || query.includes('security') || query.includes('sgsecure') ||
          query.includes('chemical') || query.includes('hide') || query.includes('run')) {
        sections.push(HANDBOOK_SECTIONS.terrorism);
      }
  
      // Default sections if no specific match
      if (sections.length === 0) {
        sections.push(HANDBOOK_SECTIONS.emergency_contacts);
        sections.push(HANDBOOK_SECTIONS.first_aid);
      }
  
      // Limit to 2 sections to avoid token limits
      return sections.slice(0, 2).join('\n\n--- ADDITIONAL REFERENCE ---\n\n');
    }
  
    static async getResponse(userMessage, userContext = {}) {
      try {
        const relevantContext = this.getRelevantSections(userMessage);
        
        const systemPrompt = `You are ReadySG's emergency preparedness assistant for Singapore, based on official SCDF Emergency Handbook.
  
  OFFICIAL SCDF HANDBOOK REFERENCE:
  ${relevantContext}
  
  Answer based on the official handbook content above. Be accurate, helpful, and reference specific procedures when applicable. Keep responses under 150 words with helpful emojis.
  
  User's current status: ${JSON.stringify(userContext)}`;
  
        const response = await fetch(OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data.choices[0].message.content.trim();
        
      } catch (error) {
        console.error('AI Error:', error);
        return this.getLocalResponse(userMessage);
      }
    }
  
    // Enhanced fallback responses using actual handbook content
    static getLocalResponse(userInput) {
      const input = userInput.toLowerCase();
      
      if (input.includes('flood') || input.includes('water')) {
        return "🌊 Flash floods: Never drive through water! 'Turn Around, Don't Drown.' If vehicle stalls, abandon immediately and seek higher ground. Call 995 for emergencies.";
      }
      
      if (input.includes('fire')) {
        return "🔥 Fire safety: Don't panic, evacuate safely, dial 995. Use P.A.S.S. method for extinguisher: Pull pin, Aim at base, Squeeze lever, Sweep side to side.";
      }
      
      if (input.includes('cpr') || input.includes('unconscious')) {
        return "🆘 CPR: Check responsiveness, call 995, head-tilt-chin-lift, check breathing. If not breathing: 30 chest compressions (5cm deep, 100+/min) then 2 breaths. Repeat until help arrives.";
      }
      
      if (input.includes('ready bag') || input.includes('supplies')) {
        return "🎒 Ready Bag essentials: torchlight, batteries, medications, documents, whistle, first aid kit, N95 masks. Keep accessible, check expiry dates regularly.";
      }
      
      if (input.includes('995') || input.includes('emergency')) {
        return "📞 Singapore Emergency: 995 (Fire/Police/Ambulance), 999 (Police), 1777 (Non-emergency ambulance), 1800 280 0000 (Fire hazard reporting).";
      }
      
      return "🚨 I'm your SCDF Emergency Assistant! Ask about first aid, fire safety, floods, emergency supplies, or security procedures. Based on official Singapore Civil Defence handbook.";
    }
  }