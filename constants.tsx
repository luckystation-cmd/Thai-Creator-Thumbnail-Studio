
import { Expression, StyleOption } from './types';

export const DEFAULT_EXPRESSIONS: Expression[] = [
  { id: 'shocked', label: 'Shocked (ตกใจสุดขีด)', prompt: 'extremely shocked, wide eyes, mouth wide open in surprise, intense reaction', icon: '😲', isSelected: false },
  { id: 'big_smile', label: 'Big Smile (ยิ้มกว้าง)', prompt: 'huge joyful smile, showing teeth, eyes squinting with happiness', icon: '😃', isSelected: false },
  { id: 'shushing', label: 'Shushing (จุ๊ๆ/เงียบไว้)', prompt: 'shushing gesture, finger over mouth, secretive and mysterious look', icon: '🤫', isSelected: false },
  { id: 'mind_blown', label: 'Mind Blown (อึ้งทึ่ง)', prompt: 'mind blown expression, eyes wide, hands near temples, completely amazed', icon: '🤯', isSelected: false },
  { id: 'thinking', label: 'Thinking (กำลังใช้ความคิด)', prompt: 'thoughtful expression, hand on chin, looking up with curiosity', icon: '🤔', isSelected: false },
  { id: 'angry', label: 'Angry/Furious (โกรธจัด)', prompt: 'very angry, furious expression, furrowed brows, intense aggressive look', icon: '😡', isSelected: false },
  { id: 'pointing', label: 'Pointing (ชี้ชวน)', prompt: 'pointing forward towards the camera with a friendly and engaging smile', icon: '👉', isSelected: false },
  { id: 'crying', label: 'Crying/Sad (ร้องไห้/เสียใจ)', prompt: 'sad crying expression, tears in eyes, emotional and heartbroken look', icon: '😢', isSelected: false },
  { id: 'scared', label: 'Scared (หวาดกลัว)', prompt: 'terrified expression, wide fearful eyes, pale face, intense fear', icon: '😨', isSelected: false },
  { id: 'smug', label: 'Smug/Confident (มั่นใจ/เหนือกว่า)', prompt: 'confident smug smirk, cool and relaxed expression, knowing look', icon: '😏', isSelected: false },
  { id: 'wink', label: 'Wink (ขยิบตา)', prompt: 'playful winking, friendly and charming smile, charismatic look', icon: '😉', isSelected: false },
  { id: 'disgusted', label: 'Disgusted (รังเกียจ/แหวะ)', prompt: 'disgusted face, wrinkled nose, repulsed expression, looking away', icon: '🤢', isSelected: false },
  { id: 'laughing', label: 'Laughing (หัวเราะร่า)', prompt: 'hearty laughing expression, eyes closed with joy, wide open mouth', icon: '😆', isSelected: false },
  { id: 'confused', label: 'Confused (งงสับสน)', prompt: 'confused expression, tilted head, one eyebrow raised in question', icon: '😕', isSelected: false },
  { id: 'victory', label: 'Victory (ฉลองชัยชนะ)', prompt: 'triumphant victory expression, shouting with joy, arms pumping', icon: '🏆', isSelected: false },
  { id: 'money', label: 'Money (ตาลุกวาว/รวย)', prompt: 'greedy money eyes, excited about wealth, money-themed expression', icon: '🤑', isSelected: false },
  { id: 'heart_eyes', label: 'Heart Eyes (คลั่งรัก)', prompt: 'loving expression with heart-shaped eyes, deeply enamored', icon: '😍', isSelected: false },
  { id: 'facepalm', label: 'Facepalm (เพลียจิต)', prompt: 'facepalm gesture, hand covering face in frustration or embarrassment', icon: '🤦', isSelected: false },
  { id: 'sunglasses', label: 'Cool (เท่ระเบิด)', prompt: 'wearing cool dark sunglasses, confident and stylish pose', icon: '😎', isSelected: false },
  { id: 'silly', label: 'Silly (ทะเล้น/กวนๆ)', prompt: 'silly expression, sticking tongue out, playful and funny look', icon: '😜', isSelected: false },
  { id: 'scary_laugh', label: 'Evil Laugh (หัวเราะสะใจ)', prompt: 'villainous evil laugh expression, dark and plotting look', icon: '😈', isSelected: false },
  { id: 'sleepy', label: 'Bored/Sleepy (เบื่อ/ง่วง)', prompt: 'bored and tired expression, yawning, half-closed eyes', icon: '🥱', isSelected: false },
];

export const OUTFIT_STYLES: StyleOption[] = [
  { id: 'original', label: 'ชุดเดิมที่อัปโหลด', prompt: 'keep the original clothing and accessories from the reference image', icon: '👕' },
  { id: 'suit', label: 'ชุดสูททางการ (Suit)', prompt: 'wearing a luxury professional business suit with a tie', icon: '👔' },
  { id: 'streetwear', label: 'ชุดสตรีท/ฮู้ดดี้ (Street)', prompt: 'wearing trendy modern streetwear, a stylish oversized hoodie', icon: '🧥' },
  { id: 'sport', label: 'ชุดกีฬา (Sport)', prompt: 'wearing high-performance athletic sports clothing', icon: '👟' },
  { id: 'cyberpunk', label: 'ไซเบอร์แพงก์ (Cyber)', prompt: 'wearing futuristic cyberpunk fashion with neon glowing elements', icon: '🤖' },
  { id: 'superhero', label: 'ซูเปอร์ฮีโร่ (Hero)', prompt: 'wearing a cinematic high-quality superhero tactical costume', icon: '🦸' },
  { id: 'doctor', label: 'ชุดกาวน์คุณหมอ', prompt: 'wearing a professional white doctor lab coat with a stethoscope', icon: '🥼' },
  { id: 'chef', label: 'ชุดเชฟทำอาหาร', prompt: 'wearing a white professional chef uniform and hat', icon: '👨‍🍳' },
];
