import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BaseModalComponent} from "@sb/base";

declare var BMap;
declare var BMapLib;

@Component({
    selector: 'sb-fixed-position',
    templateUrl: './fixed-position.component.html',
    styleUrls: ['./fixed-position.component.less']
})
export class FixedPositionComponent implements OnInit, AfterViewInit {

    showMapLocate = false;

    map1: any;

    overlay1: any;

    address: string;

    searchValue: string;

    local: any;

    tempCenter: any;

    geolocation: any;

    geoc: any;

    defaultMapCenter = false;

    @Output() locationValueChange = new EventEmitter<any>();

    @Output() locationChange = new EventEmitter<any>();

    @ViewChild(ElementRef, {static: true}) mapContainer1: ElementRef;

    @ViewChild('baseModal1', {static: false})
    baseModal1: BaseModalComponent;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        let that = this;
        this.map1 = new BMap.Map("mapContainer1");
        // 创建地图实例
        this.map1.centerAndZoom(new BMap.Point(118.454, 32.955), 6);
        this.map1.enableScrollWheelZoom();

        /*  this.map1.addEventListener('tilesloaded', () => {
            if (!this.defaultMapCenter) {
                this.defaultMapCenter = true;
                this.map1.centerAndZoom(new BMap.Point(118.454, 32.955), 6);
            }
        })*/


        this.local = new BMap.LocalSearch(this.map1, {
            renderOptions: {map: this.map1}
        });

        this.geoc = new BMap.Geocoder();
        this.geolocation = new BMap.Geolocation();
        this.geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == '0') {
                that.overlay1 = new BMap.Marker(r.point);
                that.setLocation(r.point);
            } else {
                console.log('无法定位到当前位置，导航失败，请手动输入当前位置！' + this.getStatus());
            }
        }, {enableHighAccuracy: true});

        that.map1.removeOverlay(that.overlay1);
        let drawingManager = new BMapLib.DrawingManager(this.map1, {
            //是否开启绘制模式
            isOpen: true,
            //是否显示工具栏
            enableDrawingTool: false,
            drawingToolOptions: {
                //偏移
                offset: new BMap.Size(80, 10),
                scale: 0.5
            },
        });

        drawingManager.addEventListener("overlaycomplete", function (e) {
            that.map1.removeOverlay(that.overlay1);
            that.overlay1 = e.overlay;
            that.setLocation(e.overlay.point);
        });
    }

    setCenterMarker() {
        setTimeout(() => {
            this.map1.addOverlay(this.overlay1);
            this.map1.panTo(this.overlay1.point);
        }, 300);

    }


    setLocationValue() {
        this.baseModal1.handleCancel();
        this.showMapLocate = false;
        this.searchValue = '';
        this.local.clearResults();
        this.locationValueChange.emit({
            address: this.address,
            coord: {lng: this.overlay1.point.lng, lat: this.overlay1.point.lat}
        });
    }

    setLocation(point) {
        let that = this;
        this.geoc.getLocation(point, function (rs) {
            let addComp = rs.addressComponents;
            that.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            that.locationChange.emit(that.overlay1.point);
        });
    }

    modalCancel() {
        this.showMapLocate = false;
    }

    searchAddress(val) {
        if (val) {
            this.local.search(val);
        } else {
            this.local.clearResults();
        }
    }

    show() {
        this.showMapLocate = true;
        this.baseModal1.showModal();
        if (!this.defaultMapCenter) {
            this.defaultMapCenter = true;
            this.setCenterMarker();
        }
    }

}
