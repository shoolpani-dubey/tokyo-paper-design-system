// Reference behavior for Tokyo Paper's interactive components.
// Not part of the system: apps (React, Vue, plain JS) own behavior.
// This file shows the keyboard and focus contract each component expects.

// Dialog: open/close through <button commandfor command="show-modal|close">.
// Browsers without invoker commands get the same behavior here.
if (!("command" in HTMLButtonElement.prototype)) {
  document.querySelectorAll("button[commandfor]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.getAttribute("commandfor"));
      if (button.getAttribute("command") === "show-modal") dialog.showModal();
      else if (button.getAttribute("command") === "close") dialog.close();
    });
  });
}

// Menu: focus the first item on open; arrows, Home/End and typeahead move
// between items; Tab closes; focus returns to the trigger.
document.querySelectorAll(".tp-menu[popover]").forEach((menu) => {
  const items = () => [...menu.querySelectorAll(".tp-menu__item:not(:disabled, [aria-disabled='true'])")];
  const trigger = document.querySelector(`[popovertarget="${menu.id}"]`);

  menu.addEventListener("toggle", (event) => {
    trigger?.setAttribute("aria-expanded", event.newState === "open");
    if (event.newState === "open") items()[0]?.focus();
    else if (menu.contains(document.activeElement) || document.activeElement === document.body) trigger?.focus();
  });

  menu.addEventListener("keydown", (event) => {
    const list = items();
    const index = list.indexOf(document.activeElement);
    let next;
    if (event.key === "ArrowDown") next = list[(index + 1) % list.length];
    else if (event.key === "ArrowUp") next = list[(index - 1 + list.length) % list.length];
    else if (event.key === "Home") next = list[0];
    else if (event.key === "End") next = list.at(-1);
    else if (event.key === "Tab") return menu.hidePopover();
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      const key = event.key.toLowerCase();
      const rotated = [...list.slice(index + 1), ...list.slice(0, index + 1)];
      next = rotated.find((item) => item.textContent.trim().toLowerCase().startsWith(key));
    }
    if (next) {
      event.preventDefault();
      next.focus();
    }
  });

  menu.addEventListener("click", (event) => {
    const item = event.target.closest(".tp-menu__item");
    if (!item || item.matches(":disabled, [aria-disabled='true']")) return;
    if (item.getAttribute("role") === "menuitemcheckbox") {
      item.setAttribute("aria-checked", item.getAttribute("aria-checked") !== "true");
      return; // checkbox items keep the menu open
    }
    menu.hidePopover();
  });
});

// Tabs: Arrow Left/Right and Home/End move and select (automatic activation);
// only the selected tab is in the Tab order.
document.querySelectorAll(".tp-tabs").forEach((tabs) => {
  const list = [...tabs.querySelectorAll('[role="tab"]')];

  const select = (tab) => {
    list.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected);
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
  };

  list.forEach((tab) => tab.addEventListener("click", () => select(tab)));

  tabs.querySelector('[role="tablist"]').addEventListener("keydown", (event) => {
    const index = list.indexOf(document.activeElement);
    const rtl = getComputedStyle(tabs).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next;
    if (event.key === forward) next = list[(index + 1) % list.length];
    else if (event.key === back) next = list[(index - 1 + list.length) % list.length];
    else if (event.key === "Home") next = list[0];
    else if (event.key === "End") next = list.at(-1);
    if (next) {
      event.preventDefault();
      next.focus();
      select(next);
    }
  });
});

// Table: a sort button toggles aria-sort (ascending ↔ descending) on its <th>,
// clears it from the other columns, and reorders the rows.
document.querySelectorAll(".tp-table").forEach((table) => {
  table.querySelectorAll(".tp-table__sort").forEach((button) => {
    button.addEventListener("click", () => {
      const th = button.closest("th");
      const column = [...th.parentElement.children].indexOf(th);
      const direction = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
      const numeric = th.classList.contains("tp-table__num");

      table.querySelectorAll("thead th[aria-sort]").forEach((other) => other.removeAttribute("aria-sort"));
      th.setAttribute("aria-sort", direction);

      const value = (row) => {
        const text = row.children[column].textContent.trim();
        return numeric ? parseFloat(text.replace(/[^\d.-]/g, "")) : text.toLowerCase();
      };
      const body = table.tBodies[0];
      const rows = [...body.rows].sort((a, b) => {
        const [x, y] = [value(a), value(b)];
        const order = x < y ? -1 : x > y ? 1 : 0;
        return direction === "ascending" ? order : -order;
      });
      body.append(...rows);
    });
  });
});

// Code block: copy the code, then confirm on the button for 2 seconds.
document.querySelectorAll(".tp-code__copy").forEach((button) => {
  const label = button.textContent;
  button.addEventListener("click", async () => {
    const code = button.closest(".tp-code").querySelector(".tp-code__body").innerText;
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied ✓";
    } catch {
      button.textContent = "Copy failed";
    }
    setTimeout(() => (button.textContent = label), 2000);
  });
});
