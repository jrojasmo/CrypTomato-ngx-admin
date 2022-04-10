import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
     CrypTomat🍅 - Universidad Nacional de Colombia. <br> Original design template <b><a href="https://akveo.github.io/ngx-admin/" target="_blank">ngx-admin</a></b>.
    </span>
    <div class="socials">
      <a href="https://github.com/jrojasmo/CryptoTools" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
