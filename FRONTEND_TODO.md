# Frontend To-Do List

This document outlines a prioritized list of tasks for future frontend development on the Verde Cannabis Marketplace application.

**High Priority**

*   **Bug Fix: Inconsistent State Management in `ProductDetailVerde.tsx`**
    *   **Description:** The `ProductDetailVerde.tsx` component uses `sessionStorage` for cart management, which is inconsistent with the rest of the application that uses a Zustand store (`useCart`). This can lead to bugs and a disconnected user experience.
    *   **Action:** This was resolved by removing the unused `ProductDetailVerde.tsx` and `ShopVerde.tsx` files.
    *   **Effort:** N/A (Completed)

*   **Refactor: Component Extraction in `BrandDashboard.tsx`**
    *   **Description:** The `BrandDashboard.tsx` component contains several sub-components that should be extracted into their own files for better code organization and reusability.
    *   **Action:** This was resolved by extracting the components into the `src/components/dashboard/brand` directory.
    *   **Effort:** N/A (Completed)

*   **Refactor: Centralize Hardcoded Values**
    *   **Description:** The `DesignCheckout.tsx` component contains a hardcoded Telegram username and WhatsApp number. These should be moved to a central configuration file.
    *   **Action:** This was resolved by moving the values to `src/lib/constants.ts`.
    *   **Effort:** N/A (Completed)

**Medium Priority**

*   **UI/UX: Enhance User Feedback with Animations**
    *   **Description:** The application could benefit from more visual feedback to enhance the user experience. For example, adding animations to buttons on click or when an item is added to the cart.
    *   **Action:** Add `framer-motion` animations to key interactive elements, such as buttons and cart interactions. I have already added an animation to the "Add to Cart" button in `ShopDetail.tsx`.
    *   **Effort:** Medium
    *   **Notes:** This can be an ongoing task to gradually improve the UI/UX of the application.

*   **Bug Fix: Remove `console.log` Statements**
    *   **Description:** The `AcceptCustomerInvite.tsx` component contains several `console.log` statements that should be removed in a production build.
    *   **Action:** This was resolved by removing the `console.log` statements.
    *   **Effort:** N/A (Completed)

*   **Refactor: Improve Error Handling**
    *   **Description:** The error handling in the application can be improved to be more user-friendly. Instead of displaying raw error messages, we should show generic and helpful messages to the user.
    *   **Action:** Review the error handling in the application and implement a more robust error handling strategy. This could involve creating a dedicated error handling component or service.
    *   **Effort:** Medium

**Low Priority**

*   **Refactor: Inconsistent Naming**
    *   **Description:** The `BrandDashboard.tsx` has a `Kpis` component, which is an abbreviation. It would be better to use a more descriptive name like `KeyPerformanceIndicators`.
    *   **Action:** Rename the `Kpis` component to `KeyPerformanceIndicators` and update its usage in `BrandDashboard.tsx`.
    *   **Effort:** Low

*   **UI/UX: Luxury Polish**
    *   **Description:** Review the current UI and identify opportunities to enhance the visual appeal and create a more luxurious user experience.
    *   **Action:** Propose and implement subtle animations, micro-interactions, and visual feedback to delight users. Refine the glassmorphism-inspired design aesthetic to ensure a cohesive and polished look and feel across the entire application.
    *   **Effort:** High
    *   **Notes:** This is a larger, more subjective task that would require design input.

*   **User Navigation Enhancement**
    *   **Description:** Analyze the current user navigation flow and identify any pain points or areas of confusion.
    *   **Action:** Propose and implement improvements to the routing, information architecture, and overall navigation structure to create a more intuitive and seamless user experience.
    *   **Effort:** High
    *   **Notes:** This would require user testing and feedback to identify pain points.
