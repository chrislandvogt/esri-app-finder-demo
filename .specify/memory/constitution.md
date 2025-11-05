# Constitutional Framework
## ESRI App Finder & Builder Assistant
**Established:** November 5, 2025
**Version:** 1.0

---

## Preamble

This constitution establishes the immutable architectural principles governing the ESRI App Finder & Builder Assistant project. These articles ensure the system delivers a fast, intuitive, and reliable experience for non-technical business users and policy makers discovering and building ESRI applications.

---

## Article I: User-First Simplicity

**Principle:** Every feature must reduce cognitive load for non-technical users.

**Constitutional Text:**
All interface elements, workflows, and responses must be comprehensible to users with no GIS or technical background. Features that require domain knowledge beyond basic map concepts are prohibited.

**Enforcement Mechanism:**
- User flows must complete core tasks (app recommendation, map creation) in ≤3 conversational turns
- All technical jargon must be translated to plain language
- Error messages must suggest actionable next steps, not technical details

**Gate Status:**
- **PASS:** Feature requires no technical knowledge
- **WARNING:** Feature uses one technical term with clear explanation
- **CRITICAL:** Feature assumes GIS expertise or uses unexplained jargon

---

## Article II: Conversational Interface Mandate

**Principle:** The chat interface is the primary interaction model.

**Constitutional Text:**
All functionality must be accessible through natural language conversation. Traditional form-based or multi-step wizards are prohibited unless proven necessary through user testing.

**Enforcement Mechanism:**
- New features must define conversational intents and sample utterances
- Button-based interactions limited to confirmation/selection only
- AI responses must guide users naturally toward goal completion

**Gate Status:**
- **PASS:** Feature fully conversational with natural language
- **WARNING:** Feature requires 1-2 button clicks for selection
- **CRITICAL:** Feature requires form completion or multi-step wizard

---

## Article III: Performance First

**Principle:** Response time directly impacts user trust.

**Constitutional Text:**
AI chat responses must begin streaming within 2 seconds. Map rendering must complete within 3 seconds. Features that degrade these thresholds are prohibited.

**Enforcement Mechanism:**
- All API endpoints must return first byte within 1 second
- Azure OpenAI calls must use streaming responses
- Map operations must use progressive rendering
- Performance budgets validated in CI/CD pipeline

**Gate Status:**
- **PASS:** Feature meets performance budgets
- **WARNING:** Feature within 20% of budget threshold
- **CRITICAL:** Feature exceeds performance budget

---

## Article IV: Data Privacy and Security

**Principle:** User data and conversations are ephemeral by design.

**Constitutional Text:**
No user data, chat history, or map configurations shall be persisted without explicit future requirements. Session data must be browser-local only. Features requiring data persistence are prohibited in v1.

**Enforcement Mechanism:**
- No database writes for user-generated content
- Session state limited to browser localStorage/sessionStorage
- ESRI API credentials managed through Azure Key Vault
- No third-party analytics tracking user behavior

**Gate Status:**
- **PASS:** Feature is stateless or uses browser-local storage only
- **WARNING:** Feature requires session-scoped server memory
- **CRITICAL:** Feature persists data to database or external service

---

## Article V: ESRI Ecosystem Integration

**Principle:** Leverage ESRI tools natively; avoid reinventing capabilities.

**Constitutional Text:**
All geospatial functionality must use ArcGIS REST API and ArcGIS Maps SDK for JavaScript. Custom mapping implementations are prohibited. The system guides users to ESRI's 12 configurable applications, not custom-built alternatives.

**Enforcement Mechanism:**
- Map rendering must use ArcGIS Maps SDK for JavaScript
- App recommendations limited to official ESRI configurable apps
- Living Atlas search uses ArcGIS REST API exclusively
- No custom geospatial libraries (Leaflet, Mapbox, etc.)

**Gate Status:**
- **PASS:** Feature uses ESRI APIs/SDKs exclusively
- **WARNING:** Feature extends ESRI functionality with thin wrapper
- **CRITICAL:** Feature uses non-ESRI mapping libraries

---

## Article VI: AI Accuracy and Transparency

**Principle:** Recommendations must be explainable and accurate.

**Constitutional Text:**
App recommendations must provide clear reasoning. AI responses must acknowledge uncertainty and offer alternatives. Hallucinated or invented ESRI features are strictly prohibited.

**Enforcement Mechanism:**
- Recommendation responses include 2-3 sentence rationale
- AI responses cite specific ESRI app capabilities
- Uncertainty expressed with phrases like "typically best for" vs "always use"
- Retrieval-Augmented Generation (RAG) validates ESRI app metadata

**Gate Status:**
- **PASS:** Feature provides reasoning and cites sources
- **WARNING:** Feature explains "what" but not "why"
- **CRITICAL:** Feature generates responses without validation

---

## Article VII: Graceful Degradation

**Principle:** Failures must not block user progress.

**Constitutional Text:**
When AI, ESRI APIs, or other dependencies fail, the system must provide manual fallback options. Silent failures are prohibited. Users must always have a path forward.

**Enforcement Mechanism:**
- API errors return user-friendly messages with fallback actions
- Living Atlas search failure offers manual URL input
- AI timeout allows direct app selection from list
- All error states tested in integration suite

**Gate Status:**
- **PASS:** Feature includes fallback for all failure modes
- **WARNING:** Feature handles 80% of failure scenarios
- **CRITICAL:** Feature fails silently or blocks user progress

---

## Article VIII: Accessibility Standards

**Principle:** The interface must be accessible to all users.

**Constitutional Text:**
All features must meet WCAG 2.1 AA compliance. Keyboard navigation, screen reader compatibility, and color contrast requirements are non-negotiable for government/policy user base.

**Enforcement Mechanism:**
- Automated accessibility testing in CI/CD (axe-core)
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Color contrast ratio ≥4.5:1 for text

**Gate Status:**
- **PASS:** Feature meets WCAG 2.1 AA
- **WARNING:** Feature has 1-2 minor accessibility issues
- **CRITICAL:** Feature fails keyboard navigation or screen reader tests

---

## Article IX: Testability and Observability

**Principle:** System behavior must be measurable and verifiable.

**Constitutional Text:**
All features must include automated tests before implementation. Production telemetry must capture recommendation quality, response times, and error rates. Untested or unobservable features are prohibited.

**Enforcement Mechanism:**
- Unit tests for business logic (80% coverage minimum)
- Integration tests for ESRI API interactions
- Azure Application Insights tracking:
  - AI recommendation accuracy
  - Chat response latency
  - ESRI API failure rates
  - User completion rates

**Gate Status:**
- **PASS:** Feature includes tests and telemetry
- **WARNING:** Feature has partial test coverage (60-79%)
- **CRITICAL:** Feature lacks automated tests or observability

---

## Amendment History

### Version 1.0 (November 5, 2025)
- Initial constitution established
- Nine core articles defined
- Enforcement gates specified

---

## Constitutional Validation

This constitution is enforced through:
1. **Planning Phase:** `/speckit.plan` validates technical plans against articles
2. **Implementation Phase:** Code reviews reference constitutional compliance
3. **CI/CD Gates:** Automated checks for performance, accessibility, testing
4. **Retrospectives:** Quarterly review of constitutional effectiveness

---

**Ratification Date:** November 5, 2025
**Next Review:** February 5, 2026
