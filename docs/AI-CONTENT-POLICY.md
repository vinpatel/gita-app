# AI Content Policy

This policy governs all AI-generated content in the Gita App project. It MUST be referenced in every AI prompt used for content generation.

---

## Purpose

To ensure that all AI-generated commentary, synthesis, and interpretive content is:
1. Free from copyright infringement
2. Philosophically accurate and tradition-attributed
3. Consistently transliterated using a single standard
4. Aligned with the canonical verse numbering structure

---

## Permitted Philosophical Traditions

AI-generated content may synthesize perspectives from the following traditions as **philosophical schools**, not as specific copyrighted texts:

- **Advaita Vedanta** — associated with Adi Shankaracharya; non-dual interpretation of Brahman and Atman
- **Vishishtadvaita** — associated with Ramanujacharya; qualified non-dualism and devotional theism
- **Bhakti traditions** — broad devotional perspectives rooted in the Vaishnava and other bhakti movements

---

## Paraphrase Requirement

All AI-generated content MUST:

- Synthesize philosophical positions in original language — no copying or close paraphrasing of published works
- Attribute ideas to traditions, not to specific modern books or authors
  - Correct: "The Advaita tradition holds that..."
  - Correct: "Ramanujacharya's Vishishtadvaita interpretation emphasizes..."
  - Incorrect: "As Prabhupada explains in Bhagavad Gita As It Is..."
  - Incorrect: "Swami Chinmayananda writes..."
- Never reproduce verbatim or near-verbatim text from any published commentary
- Use the following attribution format for generated synthesis content:
  > "AI-generated synthesis of [tradition] philosophical tradition based on public domain sources"

---

## Prohibited Sources

The following copyrighted works MUST NOT be reproduced, quoted, or closely paraphrased:

| Organization | Work | Reason |
|---|---|---|
| Bhaktivedanta Book Trust (BBT/ISKCON) | Prabhupada's *Bhagavad Gita As It Is* (translations and purports) | Active copyright held by BBT |
| Chinmaya Mission | Swami Chinmayananda's *Holy Geeta* commentary | Active copyright held by Chinmaya Mission |
| Sri Aurobindo Ashram | *Essays on the Gita* | Active copyright held by Sri Aurobindo Ashram Trust |
| Any 20th–21st century author | Any commentary still under copyright | General copyright protection |

---

## Transliteration Standard

**IAST (International Alphabet of Sanskrit Transliteration) is the ONLY accepted standard.**

The following are NOT accepted:
- Harvard-Kyoto (HK)
- ITRANS
- Velthuis
- Any other romanization scheme

IAST diacritical marks used in this project:

| Character | Name |
|-----------|------|
| ā | Long a |
| ī | Long i |
| ū | Long u |
| ṛ | Vocalic r |
| ṝ | Long vocalic r |
| ḷ | Vocalic l |
| ṃ | Anusvara |
| ḥ | Visarga |
| ṅ | Velar nasal |
| ñ | Palatal nasal |
| ṭ | Retroflex t |
| ḍ | Retroflex d |
| ṇ | Retroflex n |
| ś | Palatal sibilant |
| ṣ | Retroflex sibilant |

All Sanskrit terms, verse text, and proper names in generated content must use IAST. This standard is also enforced in the Zod schema for verse data.

---

## Verse Numbering

All verse references use the **Gita Press (Gorakhpur)** 700-verse, 18-chapter structure.

See [docs/SOURCES.md](./SOURCES.md) for the canonical verse count table.

Format: `Chapter:Verse` (e.g., `2:47` for Chapter 2, verse 47)

---

## Legal Basis

The **Delhi High Court (2024)** ruled that original Sanskrit religious scriptures are public domain. This ruling confirms that:

- The original Sanskrit text of the Bhagavad Gita is in the public domain
- Specific translations, commentaries, and purports by modern authors are copyrighted separately
- Paraphrasing and synthesizing from public domain sources, with original expression, is legally permissible

This policy ensures all generated content falls within legal, non-infringing use of public domain philosophical sources.
