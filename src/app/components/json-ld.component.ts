import { Component, HostBinding, effect, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'afb-json-ld',
  standalone: true,
  template: '',
})
export class JsonLdComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @HostBinding('innerHTML') jsonLD!: SafeHtml;

  json = input.required<Record<string, unknown>>();

  jsonEffect = effect(() => {
    this.jsonLD = this.getSafeHTML(this.json());
  });

  getSafeHTML(value: {}) {
    const json = value
      ? JSON.stringify(value, null, 2).replace(/<\/script>/g, '<\\/script>')
      : '';
    const html = `<script type="application/ld+json">${json}</script>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
