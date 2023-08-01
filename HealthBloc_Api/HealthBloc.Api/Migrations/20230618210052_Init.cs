using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthBloc.Api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HealthProviders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Specialty = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthProviders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NationalID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsDoctor = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthProviderStaffs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HealthProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthProviderStaffs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthProviderStaffs_HealthProviders_HealthProviderId",
                        column: x => x.HealthProviderId,
                        principalTable: "HealthProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthProviderStaffs_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PrimaryHealthProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LastHealthProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BlocReference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IpfsReference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullMedicalData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SummarizedMedicalData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NfcMedicalData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_HealthProviders_LastHealthProviderId",
                        column: x => x.LastHealthProviderId,
                        principalTable: "HealthProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patients_HealthProviders_PrimaryHealthProviderId",
                        column: x => x.PrimaryHealthProviderId,
                        principalTable: "HealthProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Patients_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientAllergies",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PatientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAllergies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientAllergies_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientTreatments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PatientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HealthProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TreatmentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TreatmentDetails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TreatmentMedication = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientTreatments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientTreatments_HealthProviders_HealthProviderId",
                        column: x => x.HealthProviderId,
                        principalTable: "HealthProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientTreatments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HealthProviderStaffs_HealthProviderId",
                table: "HealthProviderStaffs",
                column: "HealthProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthProviderStaffs_UserProfileId",
                table: "HealthProviderStaffs",
                column: "UserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAllergies_PatientId",
                table: "PatientAllergies",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_LastHealthProviderId",
                table: "Patients",
                column: "LastHealthProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_PrimaryHealthProviderId",
                table: "Patients",
                column: "PrimaryHealthProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_UserProfileId",
                table: "Patients",
                column: "UserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientTreatments_HealthProviderId",
                table: "PatientTreatments",
                column: "HealthProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientTreatments_PatientId",
                table: "PatientTreatments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthProviderStaffs");

            migrationBuilder.DropTable(
                name: "PatientAllergies");

            migrationBuilder.DropTable(
                name: "PatientTreatments");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "HealthProviders");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
