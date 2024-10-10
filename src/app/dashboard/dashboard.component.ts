import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StatusService } from '../services/status.service';

import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  username: string | null = null;
  emailname: string | null = null;
  statusesA: any[] = [];
  statusesB: any[] = [];
  statusesC: any[] = [];
  filteredStatusesA: any[] = [];
  filteredStatusesB: any[] = [];
  filteredStatusesC: any[] = [];
  activeMenuIndexA: number | null = null;
  activeMenuIndexB: number | null = null;
  activeMenuIndexC: number | null = null;
  selectedStatus: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private location: Location,
    private statusService: StatusService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    console.log('Email:', email);

    if (email) {
      this.emailname = email.split('@')[0];
      console.log('user name:', this.emailname);
    } else {
      console.error('No email found in local storage');
    }

    this.statusService.getStatuses().subscribe((data) => {
      this.statusesA = data.serverA;
      this.statusesB = data.serverB;
      this.statusesC = data.serverC;

      this.filteredStatusesA = this.statusesA;
      this.filteredStatusesB = this.statusesB;
      this.filteredStatusesC = this.statusesC;
    });
  }
  filterStatuses() {
    this.filteredStatusesA = this.selectedStatus
      ? this.statusesA.filter((status) => status.status === this.selectedStatus)
      : this.statusesA;

    this.filteredStatusesB = this.selectedStatus
      ? this.statusesB.filter((status) => status.status === this.selectedStatus)
      : this.statusesB;

    this.filteredStatusesC = this.selectedStatus
      ? this.statusesC.filter((status) => status.status === this.selectedStatus)
      : this.statusesC;
  }
  toggleMenu(menuTrigger: any, index: number, server: string) {
    if (server === 'A') {
      if (this.activeMenuIndexA === index) {
        this.activeMenuIndexA = null;
        menuTrigger.closeMenu();
      } else {
        this.activeMenuIndexA = index;
        this.activeMenuIndexB = null;
        this.activeMenuIndexC = null;
        menuTrigger.openMenu();
      }
    } else if (server === 'B') {
      if (this.activeMenuIndexB === index) {
        this.activeMenuIndexB = null;
        menuTrigger.closeMenu();
      } else {
        this.activeMenuIndexB = index;
        this.activeMenuIndexA = null;
        this.activeMenuIndexC = null;
        menuTrigger.openMenu();
      }
    } else if (server === 'C') {
      if (this.activeMenuIndexC === index) {
        this.activeMenuIndexC = null;
        menuTrigger.closeMenu();
      } else {
        this.activeMenuIndexC = index;
        this.activeMenuIndexA = null;
        this.activeMenuIndexB = null;
        menuTrigger.openMenu();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isMenuOpenA = this.activeMenuIndexA !== null;
    const isMenuOpenB = this.activeMenuIndexB !== null;
    const isMenuOpenC = this.activeMenuIndexC !== null;

    if (!target.closest('.custom-div') && !target.closest('.mat-menu-panel')) {
      if (isMenuOpenA) this.activeMenuIndexA = null;
      if (isMenuOpenB) this.activeMenuIndexB = null;
      if (isMenuOpenC) this.activeMenuIndexC = null;
    }
  }

  menuMouseLeave(
    menuTrigger: any,
    event: MouseEvent,
    index: number,
    server: string
  ) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (
      relatedTarget &&
      !relatedTarget.closest('.mat-menu-panel') &&
      !relatedTarget.closest('.custom-div')
    ) {
      if (server === 'A') {
        this.activeMenuIndexA = null;
        menuTrigger.closeMenu();
      } else if (server === 'B') {
        this.activeMenuIndexB = null;
        menuTrigger.closeMenu();
      } else if (server === 'C') {
        this.activeMenuIndexC = null;
        menuTrigger.closeMenu();
      }
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'Up':
        return 'green';
      case 'Down':
        return 'red';
      case 'Degraded':
        return 'blue';
      default:
        return 'black';
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('email');
      this.router.navigate(['/login']).then(() => {
        this.location.replaceState('/login');
      });
    });
  }
}
