import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ZonaFormComponent } from '../../components/zona-form/zona-form.component';
import { ZonaService } from '../../../../core/services/zona.service';
import { Zona } from '../../../../core/models/zona.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-zonas-page',
  templateUrl: './zonas-page.component.html',
  styleUrls: ['./zonas-page.component.css']
})
export class ZonasPageComponent implements OnInit {
  zonas: Zona[] = [];
  isLoading = true;
  displayedColumns: string[] = ['zona', 'descripcion', 'acciones'];

  constructor(
    private zonaService: ZonaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadZonas();
  }

  loadZonas(): void {
    this.isLoading = true;
    this.zonaService.getAll().subscribe({
      next: (zonas) => {
        this.zonas = zonas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las zonas:', error);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ZonaFormComponent, {
      width: '500px',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZonas();
      }
    });
  }

  openEditDialog(zona: Zona): void {
    const dialogRef = this.dialog.open(ZonaFormComponent, {
      width: '500px',
      data: { isEditing: true, zona }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZonas();
      }
    });
  }

  onDelete(zona: Zona): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Zona',
        message: `¿Está seguro de que desea eliminar la zona "${zona.zona}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteZona(zona.idZona);
      }
    });
  }

  private deleteZona(id: number): void {
    this.zonaService.delete(id).subscribe({
      next: () => {
        this.loadZonas();
      },
      error: (error) => {
        console.error('Error al eliminar la zona:', error);
      }
    });
  }
}
