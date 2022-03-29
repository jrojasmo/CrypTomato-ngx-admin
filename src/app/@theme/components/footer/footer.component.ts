import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
     CrypTomat🍅 - Universidad Nacional de Colombia. <br> Design created by <b><a href="https://akveo.page.link/8V2f" target="_blank">Akveo</a></b>.
    </span>
    <div class="socials">
      <a href="https://github.com/jrojasmo/CryptoTools" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
