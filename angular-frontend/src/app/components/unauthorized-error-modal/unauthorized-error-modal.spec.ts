import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedErrorModal } from './unauthorized-error-modal';

describe('UnauthorizedErrorModal', () => {
  let component: UnauthorizedErrorModal;
  let fixture: ComponentFixture<UnauthorizedErrorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedErrorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedErrorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
