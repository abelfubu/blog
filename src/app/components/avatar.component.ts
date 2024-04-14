import { Component } from '@angular/core';

@Component({
  selector: 'afb-avatar',
  standalone: true,
  template: `
    <img
      class="w-8 h-8 rounded-full"
      ngSrc="https://avatars.githubusercontent.com/u/65258220?v=4"
      height="32"
      width="32"
      alt="Abel de la Fuente"
    />
  `,
})
export class AvatarComponent {}
